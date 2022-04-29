<script lang="ts">
    import {onMount} from "svelte";
    import {fade, fly} from 'svelte/transition';
    import {expoOut} from "svelte/easing";

    import "carbon-components-svelte/css/all.css";
    import {
        Content,
        Header,
        SideNav,
        SideNavDivider,
        SideNavItems,
        SideNavLink,
        SkeletonText,
        SkipToContent,
        Tile
    } from "carbon-components-svelte";

    import LearnMore from "./components/modals/LearnMore.svelte";
    import Captcha from "./components/modals/Captcha.svelte";
    import ErrorModal from "./components/modals/ErrorModal.svelte";
    import PostDisplayParent from "./components/postview/PostDisplayParent.svelte";
    import PostSubmit from "./components/PostSubmit.svelte";

    import {parseTree} from "./utils.ts";
    import {BACKEND_BASE_URL} from "./config.ts";
    import {errorModal, selectedId, submissionValue, voteAction, voteId, voteMap, voteStatus} from './stores.ts';

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
                    // process votes, save them to a store
                    voteMap.set(new Map((await response.json()).map(i => [i.id, {
                        likes: i.likes,
                        dislikes: i.dislikes
                    }])));
                    // console.log($voteMap);
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
Header is annoying to use...
https://github.com/carbon-design-system/carbon-components-svelte/issues/786
https://github.com/carbon-design-system/carbon-components-svelte/issues/245
-->

<Header company="" platformName="Accent" bind:isSideNavOpen={uiStatus.isSideNavOpen}>
    <svelte:fragment slot="skip-to-content">
        <SkipToContent/>
    </svelte:fragment>
    <SideNav bind:isOpen={uiStatus.isSideNavOpen}>
        <SideNavItems>
            <SideNavLink text="Home" href="/"/>
            <SideNavDivider/>
            <SideNavLink text="Why?" href="/"/>
            <SideNavLink text="Source Code" href="/"/>
        </SideNavItems>
    </SideNav>
</Header>

<!-- margin-top is 3rem by default for the Container component, which introduces a scrollbar - so we add this to the padding instead -->
<Content style="margin-top: 0; padding-top: 5rem;">
    <div class="content-container">
        <!-- large scrolling banner -->
        <Tile style="margin-bottom: 2rem;">
            <marquee><h3>Make a post - see a post!</h3></marquee>
        </Tile>
        <!-- area for received posts -->
        {#if uiStatus.isPostLoading}
            <SkeletonText paragraph/>
        {:else}
            <PostDisplayParent
                    on:voteEvent={performVote}
                    fetchedPostTree={fetchedPostTree}
            />
        {/if}
        <!-- post composer area -->
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
    </div>
</Content>

<!-- modals -->
<LearnMore bind:isLearnMoreOpen={uiStatus.isLearnMoreOpen}/>
<ErrorModal/>
<Captcha on:postEvent={performPost} bind:isCaptchaOpen={uiStatus.isCaptchaOpen}/>

<!-- we must manually insert padding with a media query to stop the expanded sidebar from overlapping the site content -->
<style>
    @media (min-width: 1056px) {
        .content-container {
            padding-left: 16rem;
        }
    }
</style>
