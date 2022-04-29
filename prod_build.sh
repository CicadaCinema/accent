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

# create a backup copy of the affected file
cp src/lib/config.ts src/lib/config.ts.bak

# perform sed operations
sed -i "$sed_replacement_base_url_change" src/lib/config.ts
sed -i "$sed_replacement_recaptcha_site_key_change" src/lib/config.ts

# show diff (viewable in build logs)
diff src/lib/config.ts src/lib/config.ts.bak

# the backup is now redundant
rm src/lib/config.ts.bak
