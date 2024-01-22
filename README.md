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
      import { DxpShopifyImg } from 'dxpComponents';
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

### Technical Implementation

<b>checkIfImageExists(src: string)</b>

Purpose
* This function serves the purpose of determining whether an image exists at a specified URL.

Usage
* Accepts a single parameter <b>'src'</b> (Type: string), representing the URL of the image to be checked.
* Returns a promise that resolves with <b>'True'</b> if the image exists and rejects with <b>'False'</b> if it does not.

Implementation
* Creates a new <b>Image</b> object and sets event handlers for <b>onload</b> and <b>onerror</b>.
* <b>onload</b> resolves the Promise with true when the image is successfully loaded.
* <b>onerror</b> rejects the Promise with false if there is an error loading the image.
* Sets the source URL for the image from URL given as a argument.

<br>
<b>prepareImgUrl(src: string, size?: string)</b>

Purpose
* It is function to modify the image URL based on the provided size or return the original URL if no size is specified. 

Usage
* Accepts two parameters:
  * "src": (Type - String) Original URL of the image
  * "size": (Type - String, Optional) The size of the image
* Returns as a String a modified URL of the image.

Implementation
* The function first checks if a size parameter is provided. If not, it directly returns the original image URL.
* If a size is provided, the function modifies the image URL based on the specified size. It uses regular expressions to remove any existing size information from the URL and appends the new size.

<br>
<b>setImgUrl()</b>

Purpose
* This is called once the component mounted, responsible for setting the image URL based on certain conditions.

Implementation
* If image URL is given in props as 'src', this calls the prepareImgUrl function with 'src' as a parameter to generate the modified image URL.
* Then this checks if the URL exisis using 'checkIfImageExists' function, and updates the value of imageUrl if the image is found.
