#!/bin/bash

# before building Accent for production use, run this script with the following arguments:
# 1) your backend base url
# 2) your recaptcha site key

# prepare sed replace operation for base url
sed_replacement_base_url_change='s/http:\/\/localhost:8080/'
sed_replacement_base_url_change+=$1
sed_replacement_base_url_change+='/g'

# prepare sed replace operation for recaptcha site key
sed_replacement_recaptcha_site_key_change='s/6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI/'
sed_replacement_recaptcha_site_key_change+=$2
sed_replacement_recaptcha_site_key_change+='/g'

# create backup copies of the affected files
cp src/Config.svelte src/Config.svelte.bak
cp src/components/Captcha.svelte src/components/Captcha.svelte.bak

# perform sed operations
sed -i "$sed_replacement_base_url_change" src/Config.svelte
sed -i "$sed_replacement_recaptcha_site_key_change" src/components/Captcha.svelte

# show diffs (viewable in build logs)
diff src/Config.svelte src/Config.svelte.bak
diff src/components/Captcha.svelte src/components/Captcha.svelte.bak

# the backups are now redundant
rm src/Config.svelte.bak
rm src/components/Captcha.svelte.bak