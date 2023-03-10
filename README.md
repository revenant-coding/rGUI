# rGUI - RAGE:MP

A multifunctional GUI Library made for the GTA Multiplayer Modification RAGE:MP which is easy to use and understand.

Currently not maintained.

<img src="https://media.discordapp.net/attachments/927044321839030312/998904468953374730/unknown.png?width=1202&height=676">

## Table of Contents

- [Functions](#functions)
- [StyleVars](#stylevars)

## Functions

Current functions:

```js

// rGUI Functions
let rGUI = new rGUIClass();                                   // rGUI's class has to be initalized now.
rGUI.BeginWindow(title, bool, position, size, menuindex);     // menuindex locks checkboxes etc to the window with the same menuindex, check the example
rGUI.GetKey(key, type);                                       // different types: JustPressed, JustReleased, IsPressed
rGUI.BlurBackground(bool);                                    
rGUI.ShowCursor(bool);                                        
rGUI.Button(title, position, size, menuindex);                
rGUI.Checkbox(title, bool, position, menuindex);              // object is your config for the checkbox, please check the example
rGUI.Slider(title, object, position, size, menuindex);        // object is your config for the slider, please check the example
rGUI.EndWindow(menuindex);                                    // always end your window
rGUI.DrawRect(position, size, color, menuindex, outmenu);     // outmenu is a bool which changes if the rect should be draw'd inside or outside of the menu

// rGUI.RAGE Functions
rGUI.RAGE.getAllOf();             // similar to mp.events.getAllOf
rGUI.RAGE.AddDataHandler();       // similar to mp.events.addDataHandler
rGUI.RAGE.Invoke();               // similar to mp.game.invoke
rGUI.RAGE.CallRemote();           // similar to mp.events.callRemote
rGUI.RAGE.CallRemoteU();          // similar to mp.events.callRemoteUnreliable
rGUI.RAGE.CallLocal();            // similar to mp.events.callLocal
rGUI.RAGE.Call();                 // similar to mp.events.call
rGUI.RAGE.AddEvent();             // similar to mp.events.add
```

## StyleVars

Current StyleVars:

```js
rGUI.Styles.DrawTitlebar           // true or false
rGUI.Styles.TitleFont              // get font number here: (https://wiki.rage.mp/index.php?title=Graphics::drawText)
rGUI.Styles.TitleOutline           // true or false
rGUI.Styles.CenterTitleText        // true or false
rGUI.Styles.MainFont               // get font number here: (https://wiki.rage.mp/index.php?title=Graphics::drawText)
rGUI.Styles.MainFontOutline        // true or false
rGUI.Styles.EnableResize           // true or false
rGUI.Styles.WindowBg               // {r: 42, g: 74, b: 123, a: 255}
rGUI.Styles.TitleBg                // {r: 42, g: 74, b: 123, a: 255}
rGUI.Styles.Seperator              // {r: 42, g: 74, b: 123, a: 255}
rGUI.Styles.CheckboxNormal         // {r: 42, g: 74, b: 123, a: 255}
rGUI.Styles.CheckboxHovered        // {r: 42, g: 74, b: 123, a: 255}
rGUI.Styles.CheckboxTick           // {r: 42, g: 74, b: 123, a: 255}
rGUI.Styles.ButtonNormal           // {r: 42, g: 74, b: 123, a: 255}
rGUI.Styles.ButtonHovered          // {r: 42, g: 74, b: 123, a: 255}
rGUI.Styles.ButtonPressed          // {r: 42, g: 74, b: 123, a: 255}
rGUI.Styles.SliderGrab             // {r: 42, g: 74, b: 123, a: 255}
rGUI.Styles.SliderNormal           // {r: 42, g: 74, b: 123, a: 255}
rGUI.Styles.SliderHovered          // {r: 42, g: 74, b: 123, a: 255}
rGUI.Styles.SliderPressed          // {r: 42, g: 74, b: 123, a: 255}
```


