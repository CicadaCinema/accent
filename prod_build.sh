#!/bin/bash

# before building Accent for production use, run this script with the following arguments:
# 1) your backend base url
# 2) your recaptcha site key

sed_replacement_base_url_change='s/http:\/\/localhost:8080/'
sed_replacement_base_url_change+=$1
sed_replacement_base_url_change+='/g'

sed_replacement_recaptcha_site_key_change='s/6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI/'
sed_replacement_recaptcha_site_key_change+=$2
sed_replacement_recaptcha_site_key_change+='/g'

cp src/App.svelte src/App.svelte.bak

sed -i "$sed_replacement_base_url_change" src/App.svelte
sed -i "$sed_replacement_recaptcha_site_key_change" src/App.svelte

diff src/App.svelte src/App.svelte.bak
rm src/App.svelte.bak