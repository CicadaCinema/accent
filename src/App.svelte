<script lang="ts">
    import {onMount} from "svelte";
    import {fade, fly} from 'svelte/transition';
    import {expoOut} from "svelte/easing";

    import "carbon-components-svelte/css/all.css";
    import {Content, Modal, SkeletonText, Tile} from "carbon-components-svelte";

    import PostDisplayParent from "./components/PostDisplayParent.svelte";
    import LearnMore from "./components/LearnMore.svelte";
    import Captcha from "./components/Captcha.svelte";
    import PostSubmit from "./components/PostSubmit.svelte";

    import {parseTree} from "./utils.ts";
    import {BACKEND_BASE_URL} from "./config.ts";
    import {voteAction, voteId, voteStatus, selectedId, submissionValue, errorModal, voteMap} from './stores.ts';

    function performPost(event) {
        fetch(`${BACKEND_BASE_URL}/api/post`, {
            method: "POST",
            headers: event.detail.captchaIncluded
                ? {
                    "captcha-token": event.detail.captchaResponse,
                    "content-type": "application/json",
                }
                : {
                    "content-type": "application/json",
                },
            body: JSON.stringify(
                $selectedId === 0
                    ? {postContent: $submissionValue}
                    : {
                        postContent: $submissionValue,
                        replyId: Number($selectedId)
                    }
            ),
        })
            .then(async (response) => {
                // regardless of whether the post was rejected or not,
                // stop loading animation and restore initial state
                uiStatus.isPostLoading = false;
                uiStatus.isPostSubmitVisible = true;

                if (response.ok) {
                    fetchedPostTree = parseTree(await response.json());
                    // console.log(JSON.stringify(fetchedPostTree, null, 2));

                    // reset UI status
                    // TODO: do these calls belong outside this if statement?
                    voteAction.set(false);
                    voteId.set(0);
                    voteStatus.set(0);
                    selectedId.set(0);
                    voteMap.set(new Map());

                    uiStatus.isSubmitDisabled = true;
                    uiStatus.isVerified = false;
                    uiStatus.isCaptchaRequired = null;
                    performVerify();
                } else {
                    errorModal.displayError("Could not submit post", await response.text());
                }
            })
            .catch((error) => {
                errorModal.displayError("Error submitting post", error.stack);
                console.log(error);
                return;
            });

        // TODO: sort out these uiStatus assignments - I'm pretty sure we don't need this many of them, some must be redundant
        uniquePostKey = {};
        submissionValue.set("");
        uiStatus.isCaptchaOpen = false;
        uiStatus.isPostSubmitVisible = false;
        uiStatus.isPostLoading = true;
    }

    function performVote(event) {
        voteAction.set(event.detail.action);
        voteId.set(event.detail.targetId);
        voteStatus.set(1);

        fetch(`${BACKEND_BASE_URL}/api/vote`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({postId: Number($voteId), voteAction: $voteAction}),
        })
            .then(async (response) => {
                if (response.ok) {
                    voteStatus.set(2);
                    voteMap.set(new Map((await response.json()).map(i => [i.id, {likes: i.likes, dislikes: i.dislikes}])));
                    console.log($voteMap);
                } else {
                    voteStatus.set(0);
                    errorModal.displayError("Could not vote on post", await response.text());
                }
            })
            .catch((error) => {
                errorModal.displayError("Error voting on post", error.stack);
                console.log(error);
                return;
            });
    }

    function performVerify() {
        fetch(`${BACKEND_BASE_URL}/api/verify`, {
            method: "GET",
        })
            .then(async (response) => {
                if (response.ok) {
                    let data = await response.json();
                    uiStatus.isVerified = true;
                    uiStatus.isCaptchaRequired = data["captchaRequired"];
                } else {
                    errorModal.displayError("Could not verify user", await response.text());
                }
            })
            .catch((error) => {
                errorModal.displayError("Error verifying user", error.stack);
                console.log(error);
                return;
            });
    }

    let uiStatus = {
        // modals
        isLearnMoreOpen: false,
        isCaptchaOpen: false,

        // visibility of elements
        isPostLoading: false,
        isSubmitDisabled: false,
        isPostSubmitVisible: true,
        isVerified: false,
        isCaptchaRequired: null,
    };

    let fetchedPostTree = {};

    // enables us to reset PostDisplayParent component https://stackoverflow.com/a/63737335
    let uniquePostKey = {};

    onMount(performVerify);
</script>

<svelte:head>
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

<!--
there's a bug that makes a vertical scrollbar appear when a Header is added...
let's leave it out for now

strictly speaking this SideNav should be outside the Header (after Header, before Content)
it is done this way to avoid a visual glitch
https://github.com/carbon-design-system/carbon-components-svelte/issues/786
-->
<!--
<Header platformName="Accent" expandedByDefault={false} bind:isSideNavOpen={uiStatus.isSideNavOpen}>
    <div slot="skip-to-content">
        <SkipToContent/>
    </div>

    <HeaderNav>
        <HeaderNavItem href="/" text="Link 1"/>
        <HeaderNavItem href="/" text="Link 2"/>
        <HeaderNavItem href="/" text="Link 3"/>
    </HeaderNav>


    <SideNav bind:isOpen={uiStatus.isSideNavOpen}>
        <SideNavItems>
            <SideNavLink href="/" text="Link 1"/>
            <SideNavLink href="/" text="Link 2"/>
            <SideNavLink href="/" text="Link 3"/>
        </SideNavItems>
    </SideNav>
</Header>
-->

<Content>
    <Tile style="margin-bottom: 2rem;">
        <marquee><h3>Make a post - see a post!</h3></marquee>
    </Tile>
    {#if uiStatus.isPostLoading}
        <SkeletonText paragraph/>
    {:else}
        <PostDisplayParent
                on:voteEvent={performVote}
                fetchedPostTree={fetchedPostTree}
        />
    {/if}
    {#if uiStatus.isPostSubmitVisible}
        {#key uniquePostKey}
            <div
                    in:fade="{{ duration: 15000 }}"
                    out:fly="{{ y: -500, duration: 1200, easing:expoOut }}"
                    on:introend="{() => uiStatus.isSubmitDisabled=false}"
            >
                <PostSubmit
                        isCaptchaRequired={uiStatus.isCaptchaRequired}
                        on:postEvent={performPost}
                        isVerified={uiStatus.isVerified}
                        isDisabled={uiStatus.isSubmitDisabled}
                        bind:isCaptchaOpen={uiStatus.isCaptchaOpen}
                        bind:isLearnMoreOpen={uiStatus.isLearnMoreOpen}
                />
            </div>
        {/key}
    {/if}

    <LearnMore bind:isLearnMoreOpen={uiStatus.isLearnMoreOpen}/>
    <!--
    <Modal
            passiveModal
            modalHeading="How does it work?"
            open={true}>
        <p>
            Make a post - see a post!
        </p>
    </Modal>
    -->
    <Modal
            passiveModal
            bind:open={$errorModal.visible}
            modalHeading={$errorModal.title}
    >
        <p>{$errorModal.body}</p>
    </Modal>
    <Captcha on:postEvent={performPost} bind:isCaptchaOpen={uiStatus.isCaptchaOpen}/>
</Content>
