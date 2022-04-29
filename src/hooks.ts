/** @type {import('@sveltejs/kit').Handle} */
export async function handle({event, resolve}) {
    return await resolve(event, {
        // https://kit.svelte.dev/docs/hooks#handle
        // ssr enabled on all routes but the main app page
        // otherwise recaptcha doesn't work
        ssr: event.url.pathname !== "/"
    });
}
