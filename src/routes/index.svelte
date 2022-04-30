<script lang="ts">
    import {onMount} from "svelte";
    import {fade, fly} from 'svelte/transition';
    import {expoOut} from "svelte/easing";

    import "carbon-components-svelte/css/all.css";
    import {
        SkeletonText,
        Tile
    } from "carbon-components-svelte";

    import LearnMore from "$lib/components/modals/LearnMore.svelte";
    import Captcha from "$lib/components/modals/Captcha.svelte";
    import ErrorModal from "$lib/components/modals/ErrorModal.svelte";
    import PostDisplayParent from "$lib/components/postview/PostDisplayParent.svelte";
    import PostSubmit from "$lib/components/PostSubmit.svelte";

    import {parseTree} from "$lib/utils";
    import {BACKEND_BASE_URL} from "$lib/config";
    import {errorModal, selectedId, submissionValue, voteAction, voteId, voteMap, voteStatus} from '$lib/stores';

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

<!--
post composer area
TODO: composer fades in when coming back to / from another route, eg /about, but we need it to only fade after submitting a post
-->
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

<!-- modals -->
<LearnMore bind:isLearnMoreOpen={uiStatus.isLearnMoreOpen}/>
<ErrorModal/>
<Captcha on:postEvent={performPost} bind:isCaptchaOpen={uiStatus.isCaptchaOpen}/>
