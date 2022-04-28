// https://typedoc.org/guides/doccomments/

/** base URL of the Dialect API backend */
export const BACKEND_BASE_URL = "http://localhost:8080";

/**
 * Parses a list of items into a tree-like structure, based on the `path` and `id` properties of the elements of the
 * list.
 *
 * Example input:
 * ```typescript
 * [ {
 *   "postContent" : "Did you know that the human body is made up of over 70 percent water? I think that's pretty cool.",
 *   "path" : "/233",
 *   "id" : 233
 * }, {
 *   "postContent" : "No, I didn't know that. How interesting!",
 *   "path" : "/233/279",
 *   "id" : 279
 * }, {
 *   "postContent" : "Of course I knew that...",
 *   "path" : "/233/284",
 *   "id" : 284
 * }, {
 *   "postContent" : "No need to be rude!",
 *   "path" : "/233/284/337",
 *   "id" : 337
 * }, {
 *   "postContent" : "I wasn't being rude!",
 *   "path" : "/233/284/337/365",
 *   "id" : 365
 * }, {
 *   "postContent" : "Lame fact.",
 *   "path" : "/233/370",
 *   "id" : 370
 * } ]
 * ```
 *
 * Example output:
 * ```typescript
 * {
 *   "id": "233",
 *   "content": "Did you know that the human body is made up of over 70 percent water? I think that's pretty cool.",
 *   "children": [
 *     {
 *       "id": "279",
 *       "content": "No, I didn't know that. How interesting!"
 *     },
 *     {
 *       "id": "284",
 *       "content": "Of course I knew that...",
 *       "children": [
 *         {
 *           "id": "337",
 *           "content": "No need to be rude!",
 *           "children": [
 *             {
 *               "id": "365",
 *               "content": "I wasn't being rude!"
 *             }
 *           ]
 *         }
 *       ]
 *     },
 *     {
 *       "id": "370",
 *       "content": "Lame fact."
 *     }
 *   ]
 * }
 * ```
 */
export function parseTree(inputList: any[]) {
    let treeTemp = [];

    // from https://stackoverflow.com/a/59049749
    inputList.reduce((r, post) => {
        post.path.slice(1).split('/').reduce((o, id) => {
            let temp = (o.children = o.children || []).find(q => q.id === id);
            if (!temp) o.children.push(temp = {id: id, content: post.postContent});
            return temp;
        }, r);
        return r;
    }, {children: treeTemp});

    return treeTemp[0];
}