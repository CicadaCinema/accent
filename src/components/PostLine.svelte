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
<div class="rootDivTestChangeMe">
    <ul>
        {#each children as file}
            <li>
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
            </li>
        {/each}
    </ul>
</div>

<style>
    .rootDivTestChangeMe {
        margin: 0.5rem;
        border: 1px solid var(--cds-interactive-04);
        display: flex;
    }

    span {
        font-weight: bold;
    }

    ul {
        padding: 0.2em 0 0 0.5em;
        margin: 0 0 0 0.5em;
        list-style: none;
    }

    li {
        padding: 0.2em 0;
    }
</style>
