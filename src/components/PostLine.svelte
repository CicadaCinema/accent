<script lang="ts">
    // copied from https://svelte.dev/tutorial/svelte-self

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
    {#each children as file}
        {#if file.children}
            <svelte:self
                    bind:voteAction={voteAction}
                    bind:voteId={voteId}
                    bind:voteStatus={voteStatus}
                    bind:isPostSelected={isPostSelected}
                    bind:selectedId={selectedId}

                    content={file.content}
                    id={file.id}
                    children={file.children}
            />
        {:else}
            <PostLineElements
                    bind:voteAction={voteAction}
                    bind:voteId={voteId}
                    bind:voteStatus={voteStatus}
                    bind:isPostSelected={isPostSelected}
                    bind:selectedId={selectedId}

                    content={file.content}
                    id={file.id}
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
