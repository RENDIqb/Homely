# Homely | Aesthetic Personal Startpage

A personal and customizable browser startpage, designed for tranquility and productivity. Homely replaces your browser's default new tab with a cozy and functional space that greets you based on the time of day, day of the week, and even holidays.

✨ **Features:**

*   **Dynamic Greetings:** A smart message that changes based on the time of day ("Early bird!" to "Burning the midnight oil"), day of the week, and special dates (Christmas, New Year).
*   **Link Organization:** Neatly categorized links (Tools, Social Media, Content) for quick access.
*   **Aesthetic Design:** A minimalist interface with a carefully selected color palette, animated buttons, and a beautiful SVG background pattern.
*   **Smooth Animations:** A pleasant loader and smooth hover transitions for buttons.
*   **Adaptive Typography:** Uses the Noto Sans font with a full range of weights for perfect text rendering.

## 🎯 Preview

**[View Homely Preview](https://rendiqb.github.io/Homely/)**

## Overview

Homely is a lightweight, customizable, and aesthetically pleasing startpage designed to replace your browser's default new tab page. It aims to create a calm and productive environment by providing a personalized greeting and organized access to your frequently visited links.

## Installation & Usage

To use Homely as your browser's startpage, you will typically need a browser extension that allows you to set a custom local HTML file as your New Tab page. Popular extensions for this purpose include:

*   **Chrome:** [Custom New Tab URL](https://chrome.google.com/webstore/detail/custom-new-tab-url/mmjbdbjnoablegbkcklggeknkfcjkjia)
*   **Firefox:** [New Tab Override](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/) (allows setting a local file in `about:config`)

1.  **Download the Project:** Clone this repository or download the ZIP file and extract it to a folder on your computer.
    ```bash
    git clone https://github.com/RENDIqb/Homely.git
    ```
2.  **Customize:** Edit the `index.html` file to add your own links to the respective categories (`Tools`, `Social Media`, `Content`).
3.  **Configure Browser/Extension:** Point your chosen extension (or browser setting) to the local path of the `index.html` file from this project.

    **Windows:**
    ```
    file:///C:/Users/YourUsername/Path/To/Homely/index.html
    ```

    **Linux:**
    ```
    file:///home/YourUsername/Path/To/Homely/index.html
    ```

## Customization

The main file for customization is `index.html`. You can easily:
*   **Add/Remove Links:** Find the sections for each category (`div class="box tools"`, `div class="box social"`, etc.) and modify the `<a>` tags with your own URLs and names.
*   **Modify Greetings:** The logic for dynamic greetings is contained within the `<script>` tag at the bottom of the HTML file. You can adjust the messages and triggering conditions to your liking.
*   **Styling:** Basic styles are included within the `<style>` tag. For more significant visual changes, consider moving the CSS to an external file.

## Technical Details

*   Built with pure **HTML**, **CSS**, and **JavaScript** (vanilla JS).
*   Uses the **Noto Sans** font from Google Fonts.
*   No external dependencies or build processes required.