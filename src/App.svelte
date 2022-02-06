<script lang="ts">
    import {onDestroy, onMount} from "svelte";

    import "carbon-components-svelte/css/all.css";
    import {Button, Content, Modal, TextInput, Tile} from "carbon-components-svelte";

    import PostDisplay from "./components/PostDisplay.svelte";

    // require this so that the captcha can find the userVerified function
    // https://stackoverflow.com/questions/59546779/
    onMount(() => {
        window.userVerified = userVerified;
    });
    onDestroy(() => {
        window.userVerified = null;
    });

    function userVerified() {
        captchaResponse = grecaptcha.getResponse();
    }

    function submitButtonCallback() {
        if (captchaResponse == "") {
            uiStatus.submissionInvalid = true;
            uiStatus.invalidText = "Please complete the captcha";
            return;
        }

        fetch(`${BACKEND_BASE_URL}/api/post`, {
            method: "POST",
            headers: {
                "captcha-token": captchaResponse,
                "content-type": "application/json",
            },
            body: JSON.stringify(!uiStatus.postSelected
                ? {postContent: uiStatus.submissionValue} : {
                    postContent: uiStatus.submissionValue,
                    replyId: uiStatus.selectedId
                }),
        })
            .then((response) => {
                if (!response.ok) {
                    uiStatus.isErrorMessageOpen = true;
                    return response.text();
                } else {
                    uiStatus.isErrorMessageOpen = false;
                    return response.json();
                }
            })
            .then((data) => {
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

        grecaptcha.reset();
        captchaResponse = "";

        uiStatus.errorMessageText = "";
        uiStatus.submissionValue = "";
        uiStatus.submissionInvalid = false;
        uiStatus.invalidText = "";
        uiStatus.voteStatus = 0;
        uiStatus.voteId = 0;
        uiStatus.postSelected = false;
        uiStatus.selectedId = 0;
    }

    let uiStatus = {
        isSideNavOpen: false,
        isLearnMoreOpen: false,
        isErrorMessageOpen: false,
        errorMessageText: "",
        submissionValue: "",
        submissionInvalid: false,
        invalidText: "",
        voteStatus: 0,
        // 0 - no vote
        // 1 - vote loading
        // 2 - vote processed
        voteId: 0,
        voteAction: false,
        // false - dislike
        // true - like
        postSelected: false,
        selectedId: 0,
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
    <TextInput
            light
            labelText="Enter note"
            placeholder="Think of something interesting..."
            bind:value={uiStatus.submissionValue}
            bind:invalid={uiStatus.submissionInvalid}
            bind:invalidText={uiStatus.invalidText}
            on:input={() => {
			if (uiStatus.submissionValue.length > 140) {
				uiStatus.submissionInvalid = true;
				uiStatus.invalidText = `Character limit exceeded: ${uiStatus.submissionValue.length}/140`;
			} else if (uiStatus.submissionInvalid) {
				uiStatus.submissionInvalid = false;
			}
		}}
    />
    <PostDisplay fetchedPosts={fetchedPosts} uiStatus={uiStatus} BACKEND_BASE_URL={BACKEND_BASE_URL}/>
    <div
            class="g-recaptcha"
            data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            data-callback="userVerified"></div>
    <Button on:click={submitButtonCallback}>
        {uiStatus.postSelected ? "Reply" : "Submit"}
    </Button>

    <Button kind="tertiary" on:click={() => {uiStatus.isLearnMoreOpen = true}}>
        Learn more
    </Button>

    <Modal
            passiveModal
            bind:open={uiStatus.isLearnMoreOpen}
            modalHeading="Learn more"
    >
        <p>Accent is a fun website! Here's how to use it:</p>
        <p>1) Think of a profound message you want the world to know.</p>
        <p>2) Complete the captcha and let the world hear you!</p>
        <p>3) Receive back someone else's thought, and any replies to it.</p>
        <p>
            4) Vote on one of the messages you've received - if you feel
            strongly about it.
        </p>
        <p>
            5) Reply to one of the existing posts, or think of something brand
            new! Go back to step 2.
        </p>
        <br/>
        <p>
            The post you see is completely random - but Accent will never show
            you your own posts. There is a limit of one post every 15 seconds.
            If you have that many good thoughts and ideas, maybe you should
            write a book!
        </p>
        <p>Remember to have fun, and enjoy using Accent!</p>
    </Modal>
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
</Content>

<style>
    .g-recaptcha {
        margin-top: 2rem;
        margin-bottom: 2rem;
    }
</style>
