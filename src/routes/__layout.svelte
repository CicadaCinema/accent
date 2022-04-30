<script lang="ts">
    import {
        Content,
        Header,
        SideNav,
        SideNavDivider,
        SideNavItems,
        SideNavLink,
        SkipToContent
    } from "carbon-components-svelte";

    import '../app.css';

    function closeSideNav() {
        if (window.matchMedia("(max-width: 1056px)").matches) {
            isSideNavOpen = false;
        }
    }

    let isSideNavOpen = false;
</script>

<!--
Header is annoying to use...
https://github.com/carbon-design-system/carbon-components-svelte/issues/786
https://github.com/carbon-design-system/carbon-components-svelte/issues/245
-->
<Header company="" platformName="Accent" bind:isSideNavOpen>
    <svelte:fragment slot="skip-to-content">
        <SkipToContent/>
    </svelte:fragment>
    <SideNav bind:isOpen={isSideNavOpen} style="border-right-color: #e0e0e0; border-right-width: 2px; border-right-style: solid;">
        <SideNavItems>
            <SideNavLink text="Home" href="/" on:click={closeSideNav}/>
            <SideNavDivider/>
            <SideNavLink text="About" href="/about" on:click={closeSideNav}/>
            <SideNavLink text="Source Code" href="/source" on:click={closeSideNav}/>
        </SideNavItems>
    </SideNav>
</Header>


<!--
margin-top is 3rem by default for the Container component, which introduces a scrollbar
so we add this to the padding-top instead
-->
<Content style="margin-top: 0; padding-top: 5rem;">
    <div class="content-container">
        <slot/>
    </div>
</Content>

<!-- we must manually insert padding-left with a media query to stop the expanded sidebar from overlapping the site content -->
<style>
    @media (min-width: 1056px) {
        .content-container {
            padding-left: 16rem;
        }
    }
</style>
