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


# Components - Overview

## DxpShopifyImg
### Introduction
The 'DxpShopifyImg' component is a component providing a centralized solution for displaying Shopify images with dynamic sizing and image Url.

The component takes an defaultImageUrl from the appContext and initialize the imageUrl with it. The default image path can be used in the 'DxpShopifyImg' component if the 'src' is not provided as a prop or if the provided image URL fails to load.

### Basic Usage
To use the DxpShopifyImg component, integrate it into your Vue 3 application. Provide the image source (src) and an optional size attribute:


      <template>
        <DxpShopifyImg src="path/to/shopify-image.jpg" size="medium" />
      </template>

      <script lang="ts">
      import { DxpShopifyImg } from '@hotwax/dxp-components';
      </script>

### Props
<b>"src"</b>
<table>
  <tr>
    <th>Decription</th>
    <td>Path to the Shopfiy image.</td>
  </tr>
  <tr>
    <th>Type</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Required</th>
    <td>False</td>
  </tr>
</table>
<br>

<b>"size"</b>
<table>
  <tr>
    <th>Description</th>
    <td>Desired image size.</td>
  </tr>
  <tr>
    <th>Type</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Required</th>
    <td>False</td>
  </tr>
  <tr>
    <th>Example</th>
    <td>pico, small, icon, thumb, etc</td>
  </tr>
</table>

### Recommendation

This component can be used anywhere for displaying image just need to pass image src as prop and optional to pass size.


## DxpProductIdentifier

### Introduction
Product Identifier typically refers to attributes or properties that uniquely identify and describe a product within a system or database. These identifiers help distinguish one product from another and provide essential information about the product.

DxpProductIdentifer component serves as a user interface for selecting primary and secondary product identifiers. The component is designed to be easily integrated into applications, offering a card-based interface with dropdowns for identifier selection.

### Basic usage
To use the DxpProductIdentifier component, integrate it into your Vue application as follows:

      <template>
        <DxpProductIdentifier />
      </template>

      <script setup lang="ts">
      import { DxpProductIdentifer } from '@hotwax/dxp-components';
      </script>

### Recommendation
The following DxpProductIdentifier component can be used anywhere in any app, with a condition that the app should have dxp-components installed as a dependency in app and the following functions from oms-api should be passed as a parameter at the time of initialization of dxp while creation of app.

* 'getProdcutIdentificationPref' and 'setProductIdentificationPref'


## DxpMenuFooterNavigation

### Introduction
The DxpMenuFooterNavigation component is designed to display and manage certain user-related information within a footer in a menu. It provides a clean and organized way to showcase the user's instance URL, time zone, and options to select product stores and Shopify configurations.

* Dynamic updates ensure that the displayed instance URL and time zone are always reflective of the latest user data.
* The user can select a specific product store and Shopify configuration if multiple options are available.
* The component emits events (updateEcomStore and updateShopifyConfig) when the user selects different options, allowing the parent component to react and update the application state accordingly.

### Basic Usage

To use the DxpMenuFooterNavigation component, integrate it into your Vue application as follows:

      <template>
        <DxpMenuFooterNavigation @update-ecom-store="setEComStore($event)" @update-shopify-config="setShopifyConfig($event)" />
      </template>

      <script lang="ts">
        import { DxpMenuFooterNavigation } from "@hotwax/dxp-components";

        export default defineComponent({
          name: "Menu",
          methods: {
            async setEComStore(event: CustomEvent) {
              if(this.userProfile && this.eComStore?.productStoreId !== event.detail.value) {
                await this.store.dispatch('user/setEcomStore', { 'productStoreId': event.detail.value })
                emitter.emit("productStoreOrConfigChanged")
              }
            },
            async setShopifyConfig(event: CustomEvent){
              await this.store.dispatch('user/setCurrentShopifyConfig', { 'shopifyConfigId': event.detail.value });
              emitter.emit("productStoreOrConfigChanged")
            }
          }
        })
      </script>

Our component allows us to change EcomStore and shopifyConfig, while the logic to change them is written in out app in parent component. For triggering those methods from our child component we are using events. We are passing these methods as argument to two events in our components. There events can be called from our component triggering those methods. 

<h4> Conditions </h4>

* Allows product stores selection only when there are multiple stores to choose from. (i.e., more than 2)
* Allows shopify configs selection only if both the given below conditions fulfill:
  * More than 1 shopify configs are availabe
  * And less than 3 product stores are available

### Events
There are some events which are passed as prop to the component from the app. Listed below are some of those events and how they are used.

<h4>updateEcomStore</h4>

* Following event is emitted when user changes the selected EcomStore from the product stores select option. 
* This event calls an method from the parent component which handles the logic for updating selected EcomStore.

<h4>updateShopifyConfig</h4>

* Following event is emitted when user chooses a shopify configs from the shopify configs select menu.
* This event calls an methods from the parent component which handles the logic for updating shopify config.

### Recommendation

The implementation of this component is heavily dependent upon applications state and methods. Some of the dependency for using this component are as follows:

* Methods for updating shopifyConfig and product stores should be passed in as a argument to events. Which are emitted from the component which on emit calls the method for updating store or config in application state.
* Application state should be sent to dxp-components with the initialisation, since this component retrieve data such as productStore, current productStore, etc from the state.