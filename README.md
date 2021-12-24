# A Privacy Policy Component for Vue Applications

[![composer version](https://poser.pugx.org/webflorist/privacy-policy-vue/v/stable)](https://packagist.org/packages/webflorist/privacy-policy-vue)
[![npm version](https://img.shields.io/npm/v/@webflorist/privacy-policy-vue.svg)](https://www.npmjs.com/package/@webflorist/privacy-policy-vue)

This package contains a **Vue3** component providing an **open source** privacy policy available in **german** and **english**.

## Features

-   **Languages**  
    Currently the package includes texts in **german** and **englich** language.

-   **Singular/Plural**  
    You can choose between a singular or plural point of view.  
    (e.g. `My website...` vs `Our website...`)

-   **Included Texts**

    -   A general **intro text**
    -   Listing of **GDPR rights**
    -   General **data security** text (SSL, etc.)
    -   **Cookies** information
    -   Information on **data processing** of third party data processors:
        -   Webserver
        -   Web analytics
        -   Interactive maps
        -   Sending of emails (e.g. contact forms)
    -   Disclaimer regarding **outgoing links**

## Requirements

## Installation

## Usage

### Named Slots

The `PrivacyPolicy` component provides the following named slots to insert custom text on various positions:

| Slot Name                         | Usage                                                                   |
| --------------------------------- | ----------------------------------------------------------------------- |
| after_intro                       | `<template #after_intro> Custom Text </template>`                       |
| gdpr_rights_start                 | `<template #gdpr_rights_start> Custom Text </template>`                 |
| gdpr_rights_end                   | `<template #gdpr_rights_end> Custom Text </template>`                   |
| security_start                    | `<template #security_start> Custom Text </template>`                    |
| security_end                      | `<template #security_end> Custom Text </template>`                      |
| cookies_start                     | `<template #cookies_start> Custom Text </template>`                     |
| cookies_end                       | `<template #cookies_end> Custom Text </template>`                       |
| data_processing_start             | `<template #data_processing_start> Custom Text </template>`             |
| data_processing_webserver_start   | `<template #data_processing_webserver_start> Custom Text </template>`   |
| data_processing_webserver_end     | `<template #data_processing_webserver_end> Custom Text </template>`     |
| data_processing_analytics_start   | `<template #data_processing_analytics_start> Custom Text </template>`   |
| data_processing_analytics_end     | `<template #data_processing_analytics_end> Custom Text </template>`     |
| data_processing_maps_start        | `<template #data_processing_maps_start> Custom Text </template>`        |
| data_processing_maps_end          | `<template #data_processing_maps_end> Custom Text </template>`          |
| data_processing_send_emails_start | `<template #data_processing_send_emails_start> Custom Text </template>` |
| data_processing_send_emails_end   | `<template #data_processing_send_emails_end> Custom Text </template>`   |
| data_processing_end               | `<template #data_processing_end> Custom Text </template>`               |
| outgoing_links_start              | `<template #outgoing_links_start> Custom Text </template>`              |
| outgoing_links_end                | `<template #outgoing_links_end> Custom Text </template>`                |
| processor_list_start              | `<template #processor_list_start> Custom Text </template>`              |
| processor_list_end                | `<template #processor_list_end> Custom Text </template>`                |

## Disclaimer

The included text _should_ be suitable for a GDPR-compliant website.

**I however do not take any responsibility whatsowever for that.**

## License

This package is open-sourced software licensed under the [MIT license](https://github.com/laravel/framework/blob/8.x/LICENSE.md).
