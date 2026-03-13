# README

This is a knockoff Roll20, which I started partially because it sounded fun,
and partially because I needed a project to submit with job applications.

Frontend for <https://github.com/chrisjmurphy96/tabletop_rpg>.
You will need the backend running for this to work, as that's how logins and player state is managed.
Built using `Angular 21.2.0` and `Node.js 24.14.0`.

## Running locally

1. Make sure you have the `Angular CLI` installed globally.
1. `npm install` to get the app's dependencies.
1. `ng serve` or `npm run start` to run the app. That's it!

## Overview

Right now there are three things this frontend contains. A basic login page, a basic account creation page,
and the RPG board. The board looks limited, but it's actually managing quite a bit. You can add new players,
and each player can be modified from color to name to position. These are all saved to a database via the backend
app, so that when the board is reloaded the players can be reloaded exactly as they were!

## Future additions

- Ability to draw on the board.
- Player sprites tied to account instead of a button. The button could be limited to the GM
  and instead used to spawn sprites for NPC's and enemies.
- Separate board sessions, which could be used for separate campaigns or maybe separate maps within a campaign.
- Probably more I haven't thought of.
