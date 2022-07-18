var rVars = {
    WindowX: 0,
    WindowY: 0,
}

var rInternal = {

    DrawRect: function (x, y, w, h, r, g, b, a) {

        mp.game.graphics.drawRect((x + w / 2) / rVars.WindowX, (y + h / 2) / rVars.WindowY, w / rVars.WindowX, h / rVars.WindowY, r, g, b, a);
    },
    DrawText: function (message, x, y, w, h, font, outline, r, g, b, a) {

        mp.game.ui.setTextEntry("STRING");
        mp.game.ui.addTextComponentSubstringPlayerName(message.toString());
        mp.game.ui.setTextFont(font);
        mp.game.ui.setTextScale(w, h);
        mp.game.ui.setTextColour(r, g, b, a);
        if (outline) {
            mp.game.graphics.drawText(message, [(x + (rText.GetTextWidth(message, font, [w, h]) / 2)) / rVars.WindowX, y / rVars.WindowY], {
                font: font,
                color: [r, g, b, a],
                scale: [w, h],
                outline: outline,
                centre: false
            });
            return;
        }
        mp.game.ui.drawText((x + (rText.GetTextWidth(message, font, [w, h]) / 2)) / rVars.WindowX, y / rVars.WindowY);
    },
    check_xy_in_xy: function (x, y, posX, posY, w, h) {

        return (posX + w > x && x > posX && posY + h > y && y > posY)
    },
    StringID: function (keyString){
      let hash = 0;
      for (charIndex = 0; charIndex < keyString.length; ++charIndex)
      {
        hash += keyString.charCodeAt(charIndex);
        hash += hash << 10;
        hash ^= hash >> 6;
      }
      hash += hash << 3;
      hash ^= hash >> 11;
      return (((hash + (hash << 15)) & 4294967295) >>> 0)
    },

};

var rText = {

    AddTextComponentSubstringPlayerName:function(text) {
        return mp.game.invoke("0x6C188BE134E074AA", text)
    },
    BeginTextCommandGetWidth:function(text) {
        return mp.game.invoke("0x54CE8AC98E120CAB", text)
    },
    SetTextFont:function(fontType) {
        return mp.game.invoke("0x66E0276CC5F6B9DA", fontType)
    },
    SetTextScale:function(scale, size) {
        return mp.game.invoke("0x07C837F9A01C34C9", scale, size)
    },
    EndTextCommandGetWidth: mp.game.ui.getTextScreenWidth,

    GetTextWidth:function(text, font, scale) {
        rText.BeginTextCommandGetWidth("STRING");
        rText.AddTextComponentSubstringPlayerName(text);
        rText.SetTextFont(font);
        rText.SetTextScale(scale[0] * 1.25, scale[1]);
        return rText.EndTextCommandGetWidth(true) * rVars.WindowX;
    }

}



var pos = [];
var currentMenuState = [];
var OldClickPos;
var guipressed = [];
var sliderpressedd = [];
var othersliderpressed = false;
var resizepressed = [];
var Init = [];                // dev var
var winsize = [];


var rStyle = {
    DrawTitlebar: true,
    TitleFont: 4,               // font type for title (gta fonts)
    TitleOutline: false,        // title text outline
    CenterTitleText: false,
    MainFont: 4,
    MainFontOutline: false,
    EnableResize: true,
    WindowBg: {                 // background color of the window
        r: 14,
        g: 14,
        b: 14,
        a: 255
    },
    TitleBg: {                  // background color of the titlebar
        r: 229,
        g: 0,
        b: 25,
        a: 255
    },
    Seperator: {          
        r: 52,
        g: 52,
        b: 52,
        a: 255
    },
    CheckboxNormal: {          // background color of the checkbox when not checked and not hovered
        r: 35,
        g: 35,
        b: 35,
        a: 255
    },
    CheckboxHovered: {          // background color of the checkbox hovered
        r: 41,
        g: 41,
        b: 41,
        a: 255
    },
    CheckboxTick: {
        r: 255,
        g: 255,
        b: 255,
        a: 220
    },
    ButtonNormal: {          
        r: 35,
        g: 35,
        b: 35,
        a: 255
    },
    ButtonHovered: {          
        r: 41,
        g: 41,
        b: 41,
        a: 255
    },
    ButtonPressed:{
        r: 35,
        g: 35,
        b: 35,
        a: 255
    },
    SliderGrab: {          
        r: 85,
        g: 85,
        b: 85,
        a: 255
    },
    SliderNormal: {          
        r: 35,
        g: 35,
        b: 35,
        a: 255
    },
    SliderHovered: {          
        r: 41,
        g: 41,
        b: 41,
        a: 255
    },
    SliderPressed:{
        r: 35,
        g: 35,
        b: 35,
        a: 255
    }

}


var rGUI = {

    BeginWindow: function (title, bool, poss, size, index) {
        

        if (!Init[index]) {
            pos[index] = poss;
            Init[index] = true;
        }
       
        winsize[index] = size;
        size =  winsize[index];

        // update screen info
        rVars.WindowX = mp.game.graphics.getScreenActiveResolution(100, 100).x
        rVars.WindowY = mp.game.graphics.getScreenActiveResolution(100, 100).y

        currentMenuState[index] = bool;

        // visible or not
        if (!bool) return;

        // draw main rectangle
        rInternal.DrawRect(pos[index].x, pos[index].y, size.x, size.y, rStyle.WindowBg.r, rStyle.WindowBg.g, rStyle.WindowBg.b, rStyle.WindowBg.a);

        if(rStyle.DrawTitlebar)
        {
            // draw title rectangle
            rInternal.DrawRect(pos[index].x, pos[index].y - 25, size.x, 25, rStyle.TitleBg.r, rStyle.TitleBg.g, rStyle.TitleBg.b, rStyle.TitleBg.a);

            // draw title text
            if(rStyle.CenterTitleText)
                rInternal.DrawText(title, (pos[index].x - rText.GetTextWidth(title, rStyle.TitleFont, [0.28, 0.28]) / 2) + (size.x / 2) , pos[index].y - 24, 0.28, 0.28, rStyle.TitleFont, rStyle.TitleOutline, 255, 255, 255, 220);
            else 
                rInternal.DrawText(title, pos[index].x + 5 , pos[index].y - 24, 0.28, 0.28, rStyle.TitleFont, rStyle.TitleOutline, 255, 255, 255, 220);
        }
      
    },
    EndWindow: function (index){

        if(rInternal.check_xy_in_xy(mp.gui.cursor.position[0], mp.gui.cursor.position[1], pos[index].x, pos[index].y - 25, winsize[index].x, 25) || guipressed[index])
        {
            if (mp.game.controls.isDisabledControlJustPressed(0, 24)) OldClickPos = mp.gui.cursor.position;
           
            if(mp.game.controls.isDisabledControlPressed(0, 24))
            {
                let newpos = mp.gui.cursor.position;
                guipressed[index] = true;
                pos[index].x += newpos[0] - OldClickPos[0];
                pos[index].y += newpos[1] - OldClickPos[1];
                OldClickPos = newpos;
                
            }
           
        }

        if (mp.game.controls.isDisabledControlJustReleased(0, 24)) 
        {
            guipressed[index] = false;
            resizepressed[index] = false;
            
        }

         // resize shit
         if(rInternal.check_xy_in_xy(mp.gui.cursor.position[0], mp.gui.cursor.position[1], pos[index].x + winsize[index].x - (25 / 2), pos[index].y + winsize[index].y - (25 / 2), 20, 20) || resizepressed[index])
         {
 
             if(!rStyle.EnableResize) return;


             if (mp.game.controls.isDisabledControlJustPressed(0, 24)) OldClickPos = mp.gui.cursor.position;
 
             mp.gui.cursor.show(false, false);
 
             var x = mp.gui.cursor.position[0];
             var y = mp.gui.cursor.position[1];
             var w = 25;
             var h = 25;
 
             if (!mp.game.graphics.hasStreamedTextureDictLoaded("mp_freemode_mc")) {
                 mp.game.graphics.requestStreamedTextureDict("mp_freemode_mc", true);
             }
 
             if (mp.game.graphics.hasStreamedTextureDictLoaded("mp_freemode_mc")) {
                 mp.game.graphics.drawSprite("mp_freemode_mc", "mouse", (x + 5) / rVars.WindowX, (y + 5) / rVars.WindowY, w / rVars.WindowX, h / rVars.WindowY, 0, 255, 255, 255, 255);
             }
 
             if(mp.game.controls.isDisabledControlPressed(0, 24))
             {
                

                 let newposs = mp.gui.cursor.position;
                 resizepressed[index] = true;
                 winsize[index].x += newposs[0] - OldClickPos[0];
                 winsize[index].y += newposs[1] - OldClickPos[1];
                 OldClickPos = newposs;

                 if(winsize[index].x <= 250)
                 {
                    winsize[index].x = 250;
                 } 
                 if(winsize[index].y <= 250)
                 {
                    winsize[index].y = 250;
                 } 
                 
             }
 
         }
    },
    DrawRect: function(posSet, size, color, index, outmenu) {

        if(!outmenu)
            if(!currentMenuState[index]) return;

        rInternal.DrawRect(pos[index].x + posSet.x, pos[index].y + posSet.y, size.x, size.y, color.r, color.g, color.b, color.a);
    },
    Button: function(title, posSet, size, index){

        if(!currentMenuState[index]) return;

        if(rInternal.check_xy_in_xy(mp.gui.cursor.position[0], mp.gui.cursor.position[1], pos[index].x + posSet.x, pos[index].y + posSet.y, size.x, size.y))
        {
            if(mp.game.controls.isDisabledControlPressed(0, 24))
            {
                rInternal.DrawRect(pos[index].x + posSet.x, pos[index].y + posSet.y, size.x, size.y, rStyle.ButtonPressed.r, rStyle.ButtonPressed.g, rStyle.ButtonPressed.b, rStyle.ButtonPressed.a);
            }
            else 
                rInternal.DrawRect(pos[index].x + posSet.x, pos[index].y + posSet.y, size.x, size.y, rStyle.ButtonHovered.r, rStyle.ButtonHovered.g, rStyle.ButtonHovered.b, rStyle.ButtonHovered.a);
        }
        else
            rInternal.DrawRect(pos[index].x + posSet.x, pos[index].y + posSet.y, size.x, size.y, rStyle.ButtonNormal.r, rStyle.ButtonNormal.g, rStyle.ButtonNormal.b, rStyle.ButtonNormal.a);


        rInternal.DrawText(title, pos[index].x + posSet.x + (size.x / 2) - (rText.GetTextWidth(title, rStyle.MainFont, [0.28, 0.28]) / 2), pos[index].y + posSet.y + (size.y / 2) - 11, 0.28, 0.28, rStyle.MainFont, rStyle.MainFontOutline, rStyle.CheckboxTick.r, rStyle.CheckboxTick.g, rStyle.CheckboxTick.b, rStyle.CheckboxTick.a);

        if(rInternal.check_xy_in_xy(mp.gui.cursor.position[0], mp.gui.cursor.position[1], pos[index].x + posSet.x, pos[index].y + posSet.y, size.x, size.y))
        {

            if(mp.game.controls.isDisabledControlJustPressed(0, 24))
            {
                return true;
            }
        }

    },
    Slider: function(title, variable, posSet, size, index){

        if(!currentMenuState[index]) return;


        if(rInternal.check_xy_in_xy(mp.gui.cursor.position[0], mp.gui.cursor.position[1], pos[index].x + posSet.x, pos[index].y + posSet.y, size.x, size.y))
        {
            if(mp.game.controls.isDisabledControlPressed(0, 24))
                rInternal.DrawRect(pos[index].x + posSet.x, pos[index].y + posSet.y, size.x, size.y, rStyle.SliderPressed.r, rStyle.SliderPressed.g, rStyle.SliderPressed.b, rStyle.SliderPressed.a);
            else 
                rInternal.DrawRect(pos[index].x + posSet.x, pos[index].y + posSet.y, size.x, size.y, rStyle.SliderHovered.r, rStyle.SliderHovered.g, rStyle.SliderHovered.b, rStyle.SliderHovered.a);
        }
        else
            rInternal.DrawRect(pos[index].x + posSet.x, pos[index].y + posSet.y, size.x, size.y, rStyle.SliderNormal.r, rStyle.SliderNormal.g, rStyle.SliderNormal.b, rStyle.SliderNormal.a);

        
        rInternal.DrawText(variable.value.toString(), pos[index].x + posSet.x + (size.x / 2) - (rText.GetTextWidth(variable.value.toString(), rStyle.MainFont, [0.28, 0.28]) / 2), pos[index].y + posSet.y + (size.y / 2) - 11, 0.28, 0.28, rStyle.MainFont, rStyle.MainFontOutline, 255, 255, 255, 220);

        var length = (variable.value - variable.min) / (variable.max - variable.min) * (size.x - 11);

        rInternal.DrawRect(pos[index].x + posSet.x + length + 2, pos[index].y + posSet.y + 2, 7, size.y - 4, rStyle.SliderGrab.r, rStyle.SliderGrab.g, rStyle.SliderGrab.b, rStyle.SliderGrab.a);

        if(rInternal.check_xy_in_xy(mp.gui.cursor.position[0], mp.gui.cursor.position[1], pos[index].x + posSet.x, pos[index].y + posSet.y, size.x, size.y) || sliderpressedd[rInternal.StringID(title)])
        {

            if(mp.game.controls.isDisabledControlPressed(0, 24))
            {
            
                sliderpressedd[rInternal.StringID(title)] = true;

                var value = (mp.gui.cursor.position[0] - pos[index].x - posSet.x) / size.x * (variable.max - variable.min) + variable.min;

                if(variable.value < variable.min) variable.value = variable.min;
                else if(variable.value > variable.max) variable.value = variable.max;
                else variable.value = Math.round(value);
                if(variable.value > variable.max) variable.value = variable.max;
                if(variable.value < variable.min) variable.value = variable.min;
            }
 
        }

        if (mp.game.controls.isDisabledControlJustReleased(0, 24)) 
        {
            sliderpressedd[rInternal.StringID(title)] = false;
            
        }

        rInternal.DrawText(title, pos[index].x + posSet.x + size.x + 3, pos[index].y + posSet.y + (size.y / 2) - 11, 0.28, 0.28, rStyle.MainFont, rStyle.MainFontOutline, rStyle.CheckboxTick.r, rStyle.CheckboxTick.g, rStyle.CheckboxTick.b, rStyle.CheckboxTick.a);

        

    },
    Checkbox: function (title, bool, posSet, index) {

        if (!currentMenuState[index]) return;

        if(rInternal.check_xy_in_xy(mp.gui.cursor.position[0], mp.gui.cursor.position[1], pos[index].x + posSet.x, pos[index].y + posSet.y, 28 + rText.GetTextWidth(title, rStyle.MainFont, [0.28, 0.28]), 25))
        {

            if (mp.game.controls.isDisabledControlJustPressed(0, 24))
            {
                bool.value = !bool.value;
            }


            rInternal.DrawRect(pos[index].x + posSet.x, pos[index].y + posSet.y, 25, 25, rStyle.CheckboxHovered.r, rStyle.CheckboxHovered.g, rStyle.CheckboxHovered.b, rStyle.CheckboxHovered.a);
        }
        else
        {
            rInternal.DrawRect(pos[index].x + posSet.x, pos[index].y + posSet.y, 25, 25, rStyle.CheckboxNormal.r, rStyle.CheckboxNormal.g, rStyle.CheckboxNormal.b, rStyle.CheckboxNormal.a);
        }
           

        rInternal.DrawText(title, pos[index].x + posSet.x + 28, pos[index].y + posSet.y + 1, 0.28, 0.28, rStyle.MainFont, rStyle.MainFontOutline, rStyle.CheckboxTick.r, rStyle.CheckboxTick.g, rStyle.CheckboxTick.b, rStyle.CheckboxTick.a);

        if(bool.value)
        {
            var x = pos[index].x + posSet.x - 7;
            var y = pos[index].y + posSet.y - 7;
            var w = 40;
            var h = 40;

            if (!mp.game.graphics.hasStreamedTextureDictLoaded("commonmenu")) {
                mp.game.graphics.requestStreamedTextureDict("commonmenu", true);
            }

            if (mp.game.graphics.hasStreamedTextureDictLoaded("commonmenu")) {
                mp.game.graphics.drawSprite("commonmenu", "shop_tick_icon", (x + w / 2) / rVars.WindowX, (y + h / 2) / rVars.WindowY, w / rVars.WindowX, h / rVars.WindowY, 0, 255, 255, 255, 240);
            }

        }

    },
    ShowCursor: function (bool) {
        if (bool) {
            mp.game.controls.disableControlAction(0, 1, true);
            mp.game.controls.disableControlAction(0, 2, true);
            mp.game.controls.disableControlAction(0, 24, true);
            mp.game.controls.disableControlAction(0, 69, true);
            mp.game.controls.disableControlAction(0, 142, true);
            mp.game.controls.disableControlAction(0, 257, true);
            mp.game.controls.disableControlAction(0, 25, true);
            mp.game.controls.disableControlAction(0, 17, true);
            mp.game.controls.disableControlAction(0, 16, true);
            mp.game.controls.disableControlAction(0, 200, true);
            mp.game.controls.disableControlAction(0, 85, true);
            mp.game.controls.disableControlAction(0, 99, true);
            mp.game.controls.disableControlAction(0, 92, true);
            mp.gui.cursor.show(false, true);

        } 
        else 
        {
            mp.gui.cursor.show(false, false);
        }
    },
    BlurBackground: function (bool) {
        if(bool)
            mp.game.graphics.transitionToBlurred(150);
        else
            mp.game.graphics.transitionFromBlurred(150);
    },
    GetKey: function (key, type) {

        switch (type) {
            case "JustPressed":
                return mp.game.controls.isDisabledControlJustPressed(0, key);

            case "JustReleased":
                return mp.game.controls.isDisabledControlJustReleased(0, key);

            case "IsPressed":
                return mp.game.controls.isDisabledControlPressed(0, key);
        }

    },

    // ragemp internals 
    RAGE: {
        getAllOf: function (e) {
            return mp.events.binded.hasOwnProperty(e) ? mp.events.binded[e].slice() : []
        },
        AddDataHandler: function (e, t) {
            mp._events.addDataHandler(e, t);
        },
        Invoke: mp.game.invoke,
        CallRemote: mp._events.callRemote,
        CallRemoteU: mp._events.callRemoteUnreliable,
        CallLocal: mp._events.callLocal,
        Call: mp._events.call,
        AddEvent: mp._events.add,
    },
   
};








// example menu starts here
var cfg = {
    menushow: false,
    gaybox: {value: true},
    gayboxx: {value: true},
    sliderint: {value: 100, min: 0, max: 100},
    sliderint2: {value: 100, min: 10, max: 360},
    menupos: {x: 250, y: 250},
    menusize: {x: 640, y: 400},

    tabindex: 0,
}

/////////////////////////////////////////////////////////
//                                                          
//  Style vars like TitleBg can also be changed in the      
//  renderer to make a rainbow Titlebar for example.       
//  Set style vars example:
//
/////////////////////////////////////////////////////////
rStyle.CenterTitleText = true; 
rStyle.TitleBg = {r: 42, g: 74, b: 123, a: 255};
rStyle.EnableResize = false;



/////////////////////////////////////////////////////////
//                                                          
//  Renders your menu and handles everthing.  
//  you can change it as you'd like. 
//  Render example:
//
/////////////////////////////////////////////////////////
rGUI.RAGE.AddEvent("render", () => {

    if(rGUI.GetKey(121, "JustReleased"))
    {
        cfg.menushow = !cfg.menushow;
        rGUI.BlurBackground(cfg.menushow);
    }
        

    rGUI.ShowCursor(cfg.menushow);  

    rGUI.BeginWindow("rGUI Example Window", cfg.menushow, cfg.menupos, cfg.menusize, 0);  // begin your window
    {
        if(rGUI.Button("Aimbot", {x: 10, y: 10}, {x: 200, y: 30}, 0))
        {
            cfg.tabindex = 0;
        }

        if(rGUI.Button("Visuals", {x: 220, y: 10}, {x: 200, y: 30}, 0))
        {
            cfg.tabindex = 1;
        }

        if(rGUI.Button("Misc", {x: 430, y: 10}, {x: 200, y: 30}, 0)) 
        {
            cfg.tabindex = 2;
        }

        rGUI.DrawRect({x: 10, y: 48}, {x: cfg.menusize.x - 20, y: 2}, rStyle.Seperator, 0);  

        if(cfg.tabindex == 0)
        {
            rGUI.Checkbox("Example Checkbox", cfg.gaybox, {x: 10, y: 60}, 0); 

            rGUI.Checkbox("Example Checkbox 2", cfg.gayboxx, {x: 10, y: 95}, 0);

            rGUI.Slider("Example Slider", cfg.sliderint, {x: 10, y: 130}, {x: 150, y: 25}, 0);

            rGUI.Slider("Example Slider 2", cfg.sliderint2, {x: 10, y: 165}, {x: 150, y: 25}, 0);

        }
    }
    rGUI.EndWindow(0);  
});


