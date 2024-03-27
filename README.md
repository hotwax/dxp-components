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
![DxpTimeZoneSwitcher](image.png)

### Change Date-Time format
You can pass a specific token string in the `dateTimeFormat` to display the timeZone as per the app. For the possible values of dateTimeFormat, check <a target="_blank" rel="noopener noreferrer" href="https://moment.github.io/luxon/#/formatting?id=table-of-tokens">here</a>.
```js
<DxpTimeZoneSwitcher dateTimeFormat="TTT" />
```
![DxpTimeZoneSwitcher with custom dateTime format](image-1.png)

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

### Recommendation
This component can be used in the apps where user wants to change the applications timeZone.
