<script lang="ts">
    // see https://svelte.dev/tutorial/svelte-self for reference

    import PostLineElements from "./PostLineElements.svelte";

    export let content: string;
    export let id: number;
    export let children;

    export let voteAction;
    export let voteId;
    export let voteStatus;
    export let isPostSelected;
    export let selectedId;
</script>

<!-- this post's elements (text content and corresponding buttons) -->
<PostLineElements
        bind:voteAction={voteAction}
        bind:voteId={voteId}
        bind:voteStatus={voteStatus}
        bind:isPostSelected={isPostSelected}
        bind:selectedId={selectedId}

        content={content}
        id={id}
/>
<div class="parent-container">
    {#each children as childPost}
        {#if childPost.children}
            <!-- if this child has children itself, then it must be rendered recursively using PostLine -->
            <svelte:self
                    bind:voteAction={voteAction}
                    bind:voteId={voteId}
                    bind:voteStatus={voteStatus}
                    bind:isPostSelected={isPostSelected}
                    bind:selectedId={selectedId}

                    content={childPost.content}
                    id={childPost.id}
                    children={childPost.children}
            />
        {:else}
            <!-- otherwise, we only need to render the child's elements (text content and corresponding buttons) -->
            <PostLineElements
                    bind:voteAction={voteAction}
                    bind:voteId={voteId}
                    bind:voteStatus={voteStatus}
                    bind:isPostSelected={isPostSelected}
                    bind:selectedId={selectedId}

                    content={childPost.content}
                    id={childPost.id}
            />
        {/if}
    {/each}
</div>

<style>
    .parent-container {
        margin: 0.2rem 0.5rem;
        border: 1px solid var(--cds-interactive-04);
    }
</style>
