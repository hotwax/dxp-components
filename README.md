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
```js
<DxpTimeZoneSwitcher dateTimeFormat="TTT" />
```
![DxpTimeZoneSwitcher with custom dateTime format](/src/assets/images/DxpTimeZoneSwticherCustomFormat.png)

### Slots
No slots are available for this component.

### Props
| Name | Description | Default Value |
| --- | --- | --- |
| showBrowserTimeZone | When `true` displays the timeZone of the browser in the timeZone selector | `true` |
| showDateTime | When `true` will display the current dateTime as per the timeZone option in the format provided in `dateTimeFormat` | `true` |
| dateTimeFormat | Pass the specific format in which you want to display the dateTime for the timeZone options. Honored only when `showDateTime` is `true`. | `t ZZZZ` |

### Methods
No methods are available for this component

### Events
| Name | Description |
| ---  | ---         |
| timeZoneUpdated | Emitted when timeZone is changed |


# Proposed Components

## DxpForm

This components handles creation and validation of the forms in the app. It wraps the logic for form creation and validation from the developers and then can directly define the form elements and pass the same in this component that automatically renders a Ionic form to be used in the app.

## Usage

```html
<template>
  <DxpForm :schema="{}" />
</template>
<script></script>
```

## Slots

## Props

| Name | Description | Type | Default Value | Required |
| --- | --- | --- | --- | --- |
| schema | Schema that the component will use to prepare the form | Object | {} | True |
| fabSaveButton | Show a fab button on the UI at the bottom right to submit the form | Boolean | true | False |
| blockSaveButton | Show a block button on the UI to submit the form | Boolean | false | False |

> Note:
>
> If both the fabSaveButton and blockSaveButton are passed as true, the component will display the fab button and the blockSaveButton property will be ignored.

## Events

| Name | Description |
| --- | --- |
| submitForm | Trigged when the form is submitted by the user |

## Methods

## Recommendation

Pattern for passing the schema prop value

schema: {
  <component-name>: {
    label // Label for the component
    val // Value against which the component will bind
    childComp // If the component supports some child components, like select having selectOption, radioGroup having radio
    options // if having childComp, then define its values in the format [{ id, val }, { id, val }],
    labelInline // When the component does not access label as prop, like checkbox,
    validations // Validation rules for the component
    ...any property supported by the component
  }
}

Following components are currently support: 

input
select
selectOption (only as child comp)
radioGroup
radio (only as child comp)
checkbox
textarea

## Implementation Details

We will have a parent `form` element to wrap all the elements inside the form.

We will use the schema passed a prop to define the complete form structure

Define a local property as `form` as an object that will help in binding the values for all the elements to its corresponding component

We can have the following types of buttons to submit the form:
- Fab Button
- Block Button

This component emits an event `submitForm` that will be handled by the parent component to perform required steps.

Validations in this component will be applied on the basis of type property defined in the component schema. For validation we need to define the structure for rules.

All the elements will be displayed in ion-list wrapped by ion-item.

Define an object consisting the type of component and actual Ionic component using which we will decide which component to render on the UI.
enum Components {
  input: "IonInput",
  select: "IonSelect",
  checkbox: "IonCheckbox",
  textarea: "IonTextarea",
  radio: "IonRadio"
}

Label for each component will be passed as a property of component in its schema, but when rendered we will use the pattern defined by Ionic when showing labels on UI, so when the label needs to be inline then we will pass a property as labelInline


schema: {
  input: {
    min: 4
    type: "text"
    .
    .
    .
    bind: "<variable>"
    // all ion-input properties,
    label: "Label"
  },
  select: {
    options: [],
    .
    .
    .
    // all ion-select properties,
    label: "Label"
  },
  textarea: {
    rows: 3,
    .
    .
    .
    // all ion-textarea properties,
    label: "Label"
  }
}

Sample Schema:

```js
schema: {
  input: {
    label: 'Id',
    type: 'text',
    validations: ['required', 'number'],
    val: "id"
  },
  select: {
    label: 'Role',
    interface: 'popover',
    childComp: 'selectOption',
    options: [
      {
        id: 'ADMIN',
        val: 'Admin',
      },
      {
        id: 'SUPER',
        val: 'Super',
      },
    ],
    val: 'role',
  },
  radioGroup: {
    label: 'Type',
    childComp: 'radio',
    options: [
      {
        id: 'ONE',
        val: 'One',
      },
      {
        id: 'TWO',
        val: 'Two',
      },
    ],
    val: 'type',
  },
  checkbox: {
    labelInline: 'Agree to terms',
    val: 'agree',
  },
  textarea: {
    labelInline: 'Additional Information',
    class: 'ion-margin-top',
    val: 'textarea',
  },
},
```