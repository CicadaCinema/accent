<script lang="ts">
    import {fade, fly} from 'svelte/transition';
    import {expoOut} from "svelte/easing";

    import "carbon-components-svelte/css/all.css";
    import {Content, Modal, SkeletonText, Tile} from "carbon-components-svelte";

    import PostDisplay from "./components/PostDisplay.svelte";
    import LearnMore from "./components/LearnMore.svelte";
    import Captcha from "./components/Captcha.svelte";
    import PostSubmit from "./components/PostSubmit.svelte";

    function triggerSubmission(event) {
        uiStatus.isCaptchaOpen = false;
        uiStatus.postSubmitVisibility = false;
        uiStatus.isPostLoading = true;

        fetch(`${BACKEND_BASE_URL}/api/post`, {
            method: "POST",
            headers: {
                "captcha-token": event.detail.captchaResponse,
                "content-type": "application/json",
            },
            body: JSON.stringify(!uiStatus.isPostSelected
                ? {postContent: uiStatus.submissionValue} : {
                    postContent: uiStatus.submissionValue,
                    replyId: uiStatus.selectedId
                }),
        })
            .then((response) => {
                fetchedPosts = [];
                uiStatus.isErrorMessageOpen = !response.ok;
                if (!response.ok) {
                    return response.text();
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                uiStatus.isPostLoading = false;
                uiStatus.postSubmitVisibility = true;
                uiStatus.isSubmitDisabled = true;
                if (uiStatus.isErrorMessageOpen) {
                    uiStatus.errorMessageText = data;
                } else {
                    fetchedPosts = data;
                }
            })
            // unexpected error in request
            .catch((error) => {
                // TODO: what should happen here?
                console.log(error);
                return;
            });

        uiStatus.errorMessageText = "";
        uiStatus.submissionValue = "";
        uiStatus.voteStatus = 0;
        uiStatus.voteId = 0;
        uiStatus.isPostSelected = false;
        uiStatus.selectedId = 0;
    }

    let uiStatus = {
        isLearnMoreOpen: false,
        isErrorMessageOpen: false,
        isCaptchaOpen: false,
        isPostLoading: false,
        isSubmitDisabled: false,
        errorMessageText: "",
        submissionValue: "",
        voteStatus: 0,
        // 0 - no vote
        // 1 - vote loading
        // 2 - vote processed
        voteId: 0,
        voteAction: false,
        // false - dislike
        // true - like
        isPostSelected: false,
        selectedId: 0,
        postSubmitVisibility: true,
    };

    let fetchedPosts = [];
    let captchaResponse = "";
    let BACKEND_BASE_URL = "http://localhost:8080";
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
        <PostDisplay fetchedPosts={fetchedPosts} bind:uiStatus={uiStatus} BACKEND_BASE_URL={BACKEND_BASE_URL}/>
    {/if}
    {#if uiStatus.postSubmitVisibility}
        <div
                in:fade="{{ duration: 15000 }}"
                out:fly="{{ y: -500, duration: 1200, easing:expoOut }}"
                on:introend="{() => uiStatus.isSubmitDisabled=false}"
        >
            <PostSubmit
                    isReply={uiStatus.isPostSelected}
                    isDisabled={uiStatus.isSubmitDisabled}
                    bind:isCaptchaOpen={uiStatus.isCaptchaOpen}
                    bind:submissionText={uiStatus.submissionValue}
                    bind:isLearnMoreOpen={uiStatus.isLearnMoreOpen}
            />
        </div>
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
            bind:open={uiStatus.isErrorMessageOpen}
            modalHeading="Error posting"
    >
        <p>{uiStatus.errorMessageText}</p>
    </Modal>
    <Captcha on:message={triggerSubmission} bind:isCaptchaOpen={uiStatus.isCaptchaOpen}/>
</Content>