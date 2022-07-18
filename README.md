# rGUI - RAGE:MP

A GUI Library made for the GTA Multiplayer Modification RAGE:MP which is easy to use and understand.

Will be updated frequently, and might be open-src'd in near future.

Currently not open-src to prevent detecting the menu.

<img src="https://i.gyazo.com/4a98d6057d7fc3f23f06b01473f1a499.jpg">

## Table of Contents

- [Functions](#functions)
- [StyleVars](#stylevars)

## Functions

Current functions:

```js

// rGUI Functions
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
rStyle.DrawTitlebar           // true or false
rStyle.TitleFont              // get font number here: (https://wiki.rage.mp/index.php?title=Graphics::drawText)
rStyle.TitleOutline           // true or false
rStyle.CenterTitleText        // true or false
rStyle.MainFont               // get font number here: (https://wiki.rage.mp/index.php?title=Graphics::drawText)
rStyle.MainFontOutline        // true or false
rStyle.EnableResize           // true or false
rStyle.WindowBg               // {r: 42, g: 74, b: 123, a: 255}
rStyle.TitleBg                // {r: 42, g: 74, b: 123, a: 255}
rStyle.Seperator              // {r: 42, g: 74, b: 123, a: 255}
rStyle.CheckboxNormal         // {r: 42, g: 74, b: 123, a: 255}
rStyle.CheckboxHovered        // {r: 42, g: 74, b: 123, a: 255}
rStyle.CheckboxTick           // {r: 42, g: 74, b: 123, a: 255}
rStyle.ButtonNormal           // {r: 42, g: 74, b: 123, a: 255}
rStyle.ButtonHovered          // {r: 42, g: 74, b: 123, a: 255}
rStyle.ButtonPressed          // {r: 42, g: 74, b: 123, a: 255}
rStyle.SliderGrab             // {r: 42, g: 74, b: 123, a: 255}
rStyle.SliderNormal           // {r: 42, g: 74, b: 123, a: 255}
rStyle.SliderHovered          // {r: 42, g: 74, b: 123, a: 255}
rStyle.SliderPressed          // {r: 42, g: 74, b: 123, a: 255}
```


