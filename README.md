# A Privacy Policy Component for Vue Applications<!-- omit in toc -->

[![npm version](https://img.shields.io/npm/v/@webflorist/privacy-policy-vue.svg)](https://www.npmjs.com/package/@webflorist/privacy-policy-vue)

This package contains a **Vue (v2/v3)** component providing an **open source** privacy policy available in **german** and **english**.

## Table of Contents<!-- omit in toc -->

- [Demo](#demo)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
  - [Example](#example)
  - [Properties](#properties)
    - [`locale`: String (mandatory)](#locale-string-mandatory)
    - [`data-controller`: Object (mandatory)](#data-controller-object-mandatory)
    - [`singular`: Boolean (optional)](#singular-boolean-optional)
    - [`data-processing`: Object (optional)](#data-processing-object-optional)
    - [`cookies`: Object (optional)](#cookies-object-optional)
    - [`processors`: Object (optional)](#processors-object-optional)
  - [Named Slots](#named-slots)
- [Disclaimer](#disclaimer)
- [License](#license)

## Demo

An demo application with the texts included in this package is avaliable at:  
<https://privacy-policy-vue-demo.netlify.app/>

## Features

- **Languages**  
  Currently the package includes texts in **german** and **english** language.

- **Singular/Plural**  
  You can choose between a singular or plural point of view.  
  (e.g. `My website...` vs `Our website...`)

- **Included Texts**

  - A general **intro text**
  - Listing of **GDPR rights**
  - Introduction of **data controller**
  - General **data security** text (SSL, etc.)
  - **Cookies** information
  - Information on **data processing** of third party data processors:
    - Webhosting
    - Web analytics
    - Interactive maps
    - Sending of emails (e.g. contact forms)
  - Disclaimer regarding **outgoing links**

## Requirements

This package has [`vue`](https://vuejs.org/) configured as a peer dependency with version `^2.0.0 || ^3.0.0`.

## Installation

Using npm:

```shell
npm install --save @webflorist/privacy-policy-vue
```

Using yarn:

```shell
yarn add @webflorist/privacy-policy-vue
```

## Usage

### Example

An example of the usage of this package (in Vue SFC `<script setup>` syntax) for a website hosted on Netlify, using Google Maps and Google Analytics and Twilio Sendgrid as the provider for sending emails would be:

```js
<script setup>

import PrivacyPolicy from '@webflorist/privacy-policy-vue'

const dataController = {
  company: 'Acme Corporation',
  name: 'John Doe',
  address: 'Acme Street 1, 123456 Acme City, USA',
  email: 'privacy@example.com',
  phone: '+1 555-0123'
}


let cookies = {
  first_party: [
    {
      name: 'session',
      purpose: 'session',
      written_on: 'every_visit',
      duration: 'end_of_session',
    },
  ],
  third_party: [
    {
      name: '_ga, _gat, _gid',
      purpose: 'analytics_third_party',
      written_on: 'accept_cookies',
      duration: 'various',
      processor: 'google_eu',
      service: 'Google Analytics',
    },
  ],
}

const dataProcessing = {
  webhosting: {
    processor: 'netlify',
    data_categories: ['usage_data'],
  },
  analytics: {
    processor: 'google_eu',
    service: 'Google Analytics',
    data_categories: ['usage_data', 'usage_statistics'],
  },
  maps: {
    processor: 'google_usa',
    service: 'Google Maps',
    data_categories: ['usage_data', 'geo_data'],
  },
  send_emails: {
    processor: 'twilio_eu',
    service: 'Twilio Sendgrid',
    data_categories: ['usage_data', 'inventory_data'],
  }
}

</script>

<template>

    <h1>Privacy Policy</h1>

    <PrivacyPolicy
      locale="en"
      :data-controller="dataController"
      :cookies="cookies"
      :data-processing="dataProcessing"
    />

</template>
```

### Properties

The `PrivacyPolicy` component takes the following properties:

#### `locale`: String (mandatory)

One of the supported languages (either `de` or `en`). This property can be reactive to achieve language switching.

#### `data-controller`: Object (mandatory)

Contact info for the data controller. The object can have the following properties:

```js
{
  organisation: 'Acme Corporation',
  name: 'John Doe',
  address: 'Acme Street 1, 123456 Acme City, USA',
  email: 'privacy@example.com',
  phone: '+1 555-0123'
}
```

#### `singular`: Boolean (optional)

Displays the text from a singular viewpoint instead of a plural.  
(e.g. `My website...` vs `Our website...`)

#### `data-processing`: Object (optional)

The data processings used by your site. Each process must be stated as a property with a the type of process as it's name and it's properties stated as a value-object.

Supported types of processes are:

- `webhosting`
- `analytics`
- `maps`
- `send_emails`

The properties of a process can be:

- `processor`: String (mandatory)  
  The key of the processor providing this processing (either one of the [included ones](https://github.com/webflorist/privacy-policy-text/blob/main/dist/json/processors.json) or one stated via the [processors property](#processors-object-optional))
- `service`: String (optional)  
  Name of the service providing this processing (e.g. `Google Analytics` or `Google Maps`)
- `data_categories`: Array (mandatory)  
  Array of data categories processed by this process. Supported values are:
  - `inventory_data`
  - `usage_data`
  - `geo_data`
  - `usage_statistics`
  - `contract_data`
  - `payment_data`

Here is an example for a full `data-processing` object:

```js
{
  webhosting: {
    processor: 'netlify',
    data_categories: ['usage_data'],
  },
  analytics: {
    processor: 'google_eu',
    service: 'Google Analytics',
    data_categories: ['usage_data', 'usage_statistics'],
  },
  maps: {
    processor: 'google_usa',
    service: 'Google Maps',
    data_categories: ['usage_data', 'geo_data'],
  },
  send_emails: {
    processor: 'twilio_eu',
    service: 'Twilio Sendgrid',
    data_categories: ['usage_data', 'inventory_data'],
  }
}
```

#### `cookies`: Object (optional)

An object describing the cookies used by your site. They are devided into first party cookies and third party ones, listed as arrays of the `first_party` and `third_party` properties of the `cookies` object.

Each cookie is described as an object with the following possible properties:

- `name`: String (mandatory)  
  The name of the cookie
- `purpose`: String (mandatory)  
  The key of the cookie purpose. Can be one of the following:
  - `session`  
    Session cookie
  - `xsrf`  
    Cookie to prevent "Cross-Site Request Forgery" attacks
  - `hide_alert`  
    Cookie to prevent displaying the cookie dialog again after hiding it
  - `all_choices`  
    Cookie storing the choices regarding various cookies displayed in the cookie dialog
  - `analytics_choice`  
    Cookie storing the choice regarding the usage of web analytics in the cookie dialog
  - `maps_choice`  
    Cookie storing the choice regarding the usage of interactive maps
  - `analytics_third_party`  
    Cookies written by the web analytics tool
  - `maps_third_party`  
    Cookies set on displaying interactive maps.
- `written_on`: String (mandatory)  
  When the cookie is created. Can be one of the following:
  - `every_visit`: Written on every visit
  - `hide_alert`: Written on hiding the cookie dialog
  - `maps`: Written on acknowledging the usage of interactive maps
  - `accept_cookies`: Written on accepting the corresponding cookies
- `duration`: String (mandatory)  
  The duration of the cookie. Can be one of the following:
  - `end_of_session`
  - `1_year`
  - `2_years`
  - `24_hours`
  - `1_minute`
  - `various`
- `processor`: String (mandatory with third party cookies)
  The key of the processor providing this processing (either one of the [included ones](https://github.com/webflorist/privacy-policy-text/blob/main/dist/json/processors.json) or one stated via the [processors property](#processors-object-optional))

Here is an example of the cookie property:

```js
{
  first_party: [
    {
      name: 'session',
      purpose: 'session',
      written_on: 'every_visit',
      duration: 'end_of_session',
    },
  ],
  third_party: [
    {
      name: '_ga, _gat, _gid',
      purpose: 'analytics_third_party',
      written_on: 'accept_cookies',
      duration: 'various',
      processor: 'google_eu',
      service: 'Google Analytics',
    },
  ],
}
```

#### `processors`: Object (optional)

Definition of processors stated with [data processings](#data-processing-object-optional) or [cookies](#cookies-object-optional).

Several processors are [already included](https://github.com/webflorist/privacy-policy-text/blob/main/dist/json/processors.json).

State your own ones in the processors property in an object with the shorthand-key of the processor as the property name and it's info as a value-object with the following properties:

- `name` String (mandatory)  
  Company name
- `address` String (mandatory)  
  Full address of the company
- `privacy_policy` String (mandatory)
  Link to the processors privacy policy
- `privacy_shield` String (optional)  
  Link to the [privacy shield](https://www.privacyshield.gov) entry of the processor.

Here is and example:

```js
{
  acme_corp: {
    name: 'Acme Corporation',
    address: 'Acme Street 1, 123456 Acme City, USA',
    privacy_policy: 'https://www.example.com/privacy',
    privacy_shield: 'https://www.privacyshield.gov/participant?id=a2zt0000000TOWQAA4'
  }
}
```

### Named Slots

The `PrivacyPolicy` component provides the following named slots to insert custom text on various positions:

| Slot Name                         | Usage                                                                   |
| --------------------------------- | ----------------------------------------------------------------------- |
| after_intro                       | `<template #after_intro> Custom Text </template>`                       |
| gdpr_rights_start                 | `<template #gdpr_rights_start> Custom Text </template>`                 |
| gdpr_rights_end                   | `<template #gdpr_rights_end> Custom Text </template>`                   |
| data_controller_start             | `<template #data_controller_start> Custom Text </template>`             |
| data_controller_end               | `<template #data_controller_end> Custom Text </template>`               |
| security_start                    | `<template #security_start> Custom Text </template>`                    |
| security_end                      | `<template #security_end> Custom Text </template>`                      |
| cookies_start                     | `<template #cookies_start> Custom Text </template>`                     |
| cookies_end                       | `<template #cookies_end> Custom Text </template>`                       |
| data_processing_start             | `<template #data_processing_start> Custom Text </template>`             |
| data_processing_webhosting_start  | `<template #data_processing_webhosting_start> Custom Text </template>`  |
| data_processing_webhosting_end    | `<template #data_processing_webhosting_end> Custom Text </template>`    |
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
