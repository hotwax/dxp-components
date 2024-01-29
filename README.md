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
## DxpImage 
### Introduction
<li> dxpImage component is designed to handle the loading and display of images.</li>
<li> It provides functionality to efficiently manage different types of image sources, including local assets, external web URLs, and images from a resource server.</li>

### Basic Usage 
The component dynamically loads and displays the specified image, considering different source scenarios, such as local assets, web URLs, or resource server images.

To use the DxpImage component, integrate it into your Vue 3 application and provide the image source (src).

      <template>
        <img :src="imageUrl" />
      </template>

      <script lang="ts">
      import { DxpImage } from "@hotwax/dxp-components";
      </script>

### Props
#### 1. src
<table>
    <thead>
      <tr>
        <th>Prop Name</th>
        <th>Description</th>
        <th>Type</th>
        <th>Required</th>
        <th>Default Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>src</code></td>
        <td>It's specifying that the component expects a prop named src.n this component props.src to access the value of the src.</td>
        <td>string</td>
        <td>False</td>
        <td>‘context.defaultImgUrl’</td>
      </tr>
    </tbody>
  </table>



## Recommendation
<li>Use the component to load and display images stored as local assets within the project directory.</li>
<li>Employ the component to fetch and showcase images from external web URLs.</li>
<li>Use the component to display images fetched from a resource server.</li>
<li>Component's dynamic nature, allowing it to adapt different image sources based on the provided <b>props.src</b>. This is useful in scenarios where image sources can vary at runtime.</li>

## DxpOmsInstanceNavigator 
### Introduction
<li> This component focuses on displaying information about the Order Management System (OMS) instance that the user is currently connected to.</li>

### Basic Usage
It is used to navigate to the OMS instance from the application. 

To use the DxpOmsInstanceNavigator component, integrate it into your Vue 3 application.

    <template>
    <DxpOmsInstanceNavigator />
    </template>

    <script>
    import { DxpOmsInstanceNavigator } from "@hotwax/dxp-components";
    </script>

###  Events 
#### 1. goToOms()
<li>The purpose of goToOms is to navigate the user to a different screen or page within the application that corresponds to a specific OMS instance.
<li>It takes two parameters: <b>token</b> (an authentication token) and <b>omsName</b> (the name of the OMS instance).


### state manamement 
#### 1.useAuthStore()
 It simplifies access to authentication state.
 The state in useAuthStore manages the data related to authentication, which is token and oms.


## DxpUserProfile  
### Introduction
<li>The User Profile Card component is designed to display user profile information, allowing users to see details such as their login ID and party name. It also provides options to perform actions like logging out and navigating to the launchpad.

### Basic Usage
UserProfile component provides a user-friendly display of profile information.

To use the DxpUserProfile component, integrate it into your Vue 3 application.

      <template>
      <DxpUserProfile @reset-state-before-logout="resetStateBeforeLogout" :userProfile="userProfile" logoutLabel="Logout" goToLabel="Go to Launchpad" />
      </template>

      <script>
      import { DxpUserProfile } from "@hotwax/dxp-components";
      </script>
    

### Props
<table>
    <thead>
      <tr>
        <th>Prop Name</th>
        <th>Description</th>
        <th>Type</th>
        <th>Required</th>
        <th>Default Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>userProfile</code></td>
        <td>User profile information object</td>
        <td>Object</td>
        <td>Yes</td>
        <td>-</td>
      </tr>
      <tr>
        <td><code>logoutLabel</code></td>
        <td>Label for the logout button</td>
        <td>String</td>
        <td>No</td>
        <td>'Logout'</td>
      </tr>
      <tr>
        <td><code>goToLabel</code></td>
        <td>Label for the go-to launchpad button</td>
        <td>String</td>
        <td>No</td>
        <td>'Go To Launchpad'</td>
      </tr>
    </tbody>
  </table>

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
