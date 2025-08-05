# DXP Components for Vue applications

## How to use?

# Contribution Guideline

1. Fork the repository and clone it locally from the `main` branch. Before starting your work make sure it's up to date with current `main` branch.
2. Pick an issue from [here](https://github.com/hotwax/dxp-components/issues). Write in the issue comment that you want to pick it, if you can't assign yourself. **Please stay assigned to one issue at a time to not block others**.
3. Create a branch for your edits. Use the following branch naming conventions: **dxp-components/issue-number**.
4. Please add issue number to your commit message.
5. Propose a Pull Request to `main` branch containing issue number and issue title.
6. Use [Pull Request template](https://github.com/hotwax/dxp-components/blob/main/.github/PULL_REQUEST_TEMPLATE.md) (it's automatically added to each PR) and fill as much fields as possible to describe your solution.
7. Reference any relevant issues or other information in your PR.
8. Wait for review and adjust your PR according to it.
9. Congrats! Your PR should now me merged in!

If you can't handle some parts of the issue then please ask for help in the comment. If you have any problems during the implementation of some complex issue, feel free to implement just a part of it.

## Report a bug or request a feature

Always define the type of issue:
* Bug report
* Feature request

While writing issues, please be as specific as possible. All requests regarding support with implementation or application setup should be sent to.

# Join the community on Discord
If you have any questions or ideas feel free to join our <a href="https://discord.gg/SwpJnpdyg3" target="_blank">Discord channel</a>

# The license

DXP Components is completely free and released under the Apache v2.0 License. Check <a href="https://github.com/hotwax/dxp-components/blob/main/LICENSE" target="_blank">LICENSE</a> for more details.

# Components
## DxpTimeZoneSwitcher

TimeZoneSwitcher provides support to select the timeZone for the application. The component uses luxon for managing the dateTime.

### Usage
```js
<DxpTimeZoneSwitcher />
```
![DxpTimeZoneSwitcher](/src/assets/images/DxpTimeZoneSwitcher.png)

### Change Date-Time format
You can pass a specific token string in the `dateTimeFormat` to display the timeZone as per the app. For the possible values of dateTimeFormat, check <a target="_blank" rel="noopener noreferrer" href="https://moment.github.io/luxon/#/formatting?id=table-of-tokens">here</a>.

```html
<template>
  <DxpTimeZoneSwitcher dateTimeFormat="TTT" />
</template>

<script setup lang="ts">
import { DxpTimeZoneSwitcher } from '@hotwax/dxp-components';
</script>
```
![DxpTimeZoneSwitcher with custom dateTime format](/src/assets/images/DxpTimeZoneSwticherCustomFormat.png)

### Slots
No slots are available for this component.

### Props
| Name | Description | Type | Default Value | Required |
| --- | --- | --- | --- | --- |
| showBrowserTimeZone | When `true` displays the timeZone of the browser in the timeZone selector | Boolean | `true` | False |
| showDateTime | When `true` will display the current dateTime as per the timeZone option in the format provided in `dateTimeFormat` | Boolean | `true` | False |
| dateTimeFormat | Pass the specific format in which you want to display the dateTime for the timeZone options. Honored only when `showDateTime` is `true`. | String | `t ZZZZ` | False |

### Methods
No methods are available for this component

### Events
| Name | Description |
| ---  | ---         |
| timeZoneUpdated | Emitted when timeZone is changed |

---

## DxpShopifyImg

The 'DxpShopifyImg' component provides a centralized solution for displaying Shopify images with dynamic sizing and image Url.

The component takes an defaultImageUrl from the appContext and initialize the imageUrl with it. The default image path can be used in the 'DxpShopifyImg' component if the 'src' is not provided as a prop or if the provided image URL fails to load.

### Usage
To use the DxpShopifyImg component, integrate it into your vue application. Provide the image source (src) and an optional size attribute:

```html
<template>
  <DxpShopifyImg src="path/to/shopify-image.jpg" size="medium" />
</template>

<script lang="ts">
import { DxpShopifyImg } from '@hotwax/dxp-components';
</script>
```

### Slots
No slots are available for this component.

### Props
| Name | Description | Type | Default Value | Required |
| --- | --- | --- | --- | --- |
| src | Path to the Shopfiy image, if image path is not passed, the component will display HotWax logo as placeholder image | String | "" | False |
| size | Desired image size | String | default, size if already defined in image url | False |

### Methods
No methods are available for this component

### Events
No events are emitted from this component

### Recommendation

This component can be used anywhere for displaying image just need to pass image src as prop and optional to pass size.

---

## DxpProductIdentifier

Product Identifier typically refers to attributes or properties that uniquely identify and describe a product within a system or database. These identifiers help distinguish one product from another and provide essential information about the product.

DxpProductIdentifer component serves as a user interface for selecting primary and secondary product identifiers. The component is designed to be easily integrated into applications, offering a card-based interface with dropdowns for identifier selection.

### Usage
To use the DxpProductIdentifier component, integrate it into your Vue application as follows:

```html
<template>
  <DxpProductIdentifier />
</template>

<script setup lang="ts">
import { DxpProductIdentifer } from '@hotwax/dxp-components';
</script>
```

### Slots
No slots are available for this component.

### Props
No props are available for this component.

### Methods
No methods are available for this component.

### Events
No events are emitted from this component.

### Recommendation
The following DxpProductIdentifier component can be used anywhere in any app, with a condition that the following functions from oms-api should be passed as a parameter at the time of initialization of dxp while creation of app.

* getProductIdentificationPref
* setProductIdentificationPref


## DxpMenuFooterNavigation

The DxpMenuFooterNavigation component is designed to display and manage certain user-related information within a footer in side menu. It provides a clean and organized way to showcase the user's instance URL, time zone, and options to update product stores and Shopify shop.

* Dynamic updates ensure that the displayed instance URL and time zone are always reflective of the latest user data.
* The user can select a specific product store and Shopify configuration if multiple options are available.
* The component emits events (updateEcomStore and updateShopifyConfig) when the user selects different options, allowing the parent component to react and update the application state accordingly.

### Usage

To use the DxpMenuFooterNavigation component, integrate it into your Vue application as follows:

```html
<template>
  <DxpMenuFooterNavigation @update-ecom-store="setEComStore($event)" @update-shopify-config="setShopifyConfig($event)" />
</template>

<script lang="ts">
  import { DxpMenuFooterNavigation } from "@hotwax/dxp-components";
</script>
```

<h4> Conditions </h4>

* Allows product stores selection only when there are multiple stores to choose from.(i.e., more than 1)
* Allows shopify configs selection only if both the given below conditions fulfill:
  * More than 1 shopify configs are available
  * And less than 3 product stores are available

### Events

| Name | Description |
| ---  | ---         |
| updateEcomStore | Emitted when ecomStore is changed |
| updateShopifyConfig | Emitted when Shopify config is changed |

### Recommendation

* Application state should be sent to dxp-components with the initialisation, since this component retrieve data such as shopify configs, current shopifyConfig, etc from the state.


## DxpImage
DxpImage component is designed to handle the loading and display of images. It provides functionality to efficiently manage different types of image sources, including local assets, external web URLs, and images from a resource server.

### Basic Usage 
The component dynamically loads and displays the specified image, considering different source scenarios, such as local assets, web URLs, or resource server images.

```html
<template>
  <img :src="imageUrl" />
</template>

<script lang="ts">
  import { DxpImage } from "@hotwax/dxp-components";
</script>
```

### Slots

### Props

| Name | Description | Type | Default Value | Required |
| --- | --- | --- | --- | --- |
| src | Path to the image, if image path is not passed, the component will display HotWax logo as placeholder image | String | "" | False |

### Recommendation
<li>Use the component to load and display images stored as local assets within the project directory.</li>
<li>Employ the component to fetch and showcase images from external web URLs.</li>
<li>Use the component to display images fetched from a resource server.</li>
<li>Component's dynamic nature, allowing it to adapt different image sources based on the provided <b>props.src</b>. This is useful in scenarios where image sources can vary at runtime.</li>

## DxpOmsInstanceNavigator

This component focuses on displaying information about the Order Management System (OMS) instance that the user is currently connected to.

### Usage
It is used to navigate to the OMS instance from the application and view the OMS instance. 

```html
<template>
  <DxpOmsInstanceNavigator />
</template>

<script>
  import { DxpOmsInstanceNavigator } from "@hotwax/dxp-components";
</script>
```

### Slots
No slots are available for this component.

### Props
No props are available for this component.

### Methods
| Name | Description |
| ---  | ---         |
| goToOms | Redirect the user to the OMS instance the app is currently connected to. |

### Events
No events are available for this component.


## DxpUserProfile

The User Profile Card component is designed to display user profile information, allowing users to see details such as their login ID, party name, and profile picture. It also provides options to perform actions like logging out and navigating to the launchpad.

### Usage

```html
<template>
  <DxpUserProfile @reset-state-before-logout="resetStateBeforeLogout" :userProfile="userProfile" logoutLabel="Logout" goToLabel="Go to Launchpad" />
</template>

<script>
  import { DxpUserProfile } from "@hotwax/dxp-components";
</script>
```

### Props

| Name | Description | Type | Default Value | Required |
| --- | --- | --- | --- | --- |
| userProfile | User profile information object | Object | "" | True |
| logoutLabel | Label for the logout button | String | Logout | False |
| goToLabel | Label for the go-to launchpad button | String | Go To Launchpad | False |

### Events

#### 1. logout()
The logout() method is triggered when the user clicks on the logout button (ion-button). It initiates the logout process for the user.

##### Events inside logout
<li><b>emit()</b> : The emit function is used to emit the before-logout event. Emitting the 'before-logout' event allows parent components or listeners to be aware of the impending logout action.
<li><b>dispatch()</b> : It dispatches the logout action defined in the user module and redirects to the login page.

#### 2. goToLaunchpad()
The goToLaunchpad() method is invoked when the user clicks on the "Go To Launchpad" button. It redirects the user to the launchpad by changing the window location.

### CSS
The scoped CSS in the provided in the component is defining styles for the .user-profile class, which is applied to a container div surrounding the user profile component. 

<li><code> 'display:grid'</code> It sets the layout of the <b>.user-profile</b> element to use CSS Grid, allowing for a flexible grid-based layout system.

<li><code>grid-template-columns:repeat(auto-fill, minmax(400px, 1fr));</code> 

This rule defines the columns for the grid layout.<br>
<b>repeat(auto-fill, minmax(400px, 1fr)):</b><br>
<b>auto-fill:</b> Automatically adds as many columns as can fit in the available space.<br>
<b>minmax(400px, 1fr):</b> Each column should have a minimum width of 400 pixels, and they can grow to take up equal fractions (1fr) of the available space.
