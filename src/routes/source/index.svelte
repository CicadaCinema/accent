<script lang="ts">
    import "carbon-components-svelte/css/all.css";
    import {SPEC_SOURCE_URL, CLIENT_SOURCE_URL, SERVER_SOURCE_URL} from "$lib/config";
</script>

<h1>Source Code</h1>
<p>This project is fully open source! Use these links to freely browse its components.</p>
<a href={SPEC_SOURCE_URL}>The Dialect spec</a>
<br>
<a href={SERVER_SOURCE_URL}>The Dialect server</a>
<br>
<a href={CLIENT_SOURCE_URL}>The Accent client</a>
