//////////////////////  rGUI Internals //////////////////////

class rGUIClass {
    pos = [];
    currentMenuState = [];
    OldClickPos;
    guipressed = [];
    sliderpressedd = [];
    othersliderpressed = false;
    resizepressed = [];
    Init = [];  // dev var
    winsize = [];

    RAGE = {
        getAllOf: (e) => {
            return mp.events.binded.hasOwnProperty(e) ? mp.events.binded[e].slice() : []
        },
        AddDataHandler: (e, t) => {
            mp._events.addDataHandler(e, t);
        },
        Invoke: mp.game.invoke,
        CallRemote: mp._events.callRemote,
        CallRemoteU: mp._events.callRemoteUnreliable,
        CallLocal: mp._events.callLocal,
        Call: mp._events.call,
        AddEvent: mp._events.add,
    }

    Styles = {
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

    rVars = {
        WindowX: 0,
        WindowY: 0,
    }

    rText = {

        rVars: this.rVars,

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
            this.BeginTextCommandGetWidth("STRING");
            this.AddTextComponentSubstringPlayerName(text);
            this.SetTextFont(font);
            this.SetTextScale(scale[0] * 1.25, scale[1]);
            return this.EndTextCommandGetWidth(true) * this.rVars.WindowX;
        }
    
    }

    rInternal = {

        rVars: this.rVars,
        rText: this.rText,

        DrawRect: function (x, y, w, h, r, g, b, a) {
    
            mp.game.graphics.drawRect((x + w / 2) / this.rVars.WindowX, (y + h / 2) / this.rVars.WindowY, w / this.rVars.WindowX, h / this.rVars.WindowY, r, g, b, a);
        },
        DrawText: function (message, x, y, w, h, font, outline, r, g, b, a) {
    
            mp.game.ui.setTextEntry("STRING");
            mp.game.ui.addTextComponentSubstringPlayerName(message.toString());
            mp.game.ui.setTextFont(font);
            mp.game.ui.setTextScale(w, h);
            mp.game.ui.setTextColour(r, g, b, a);
            if (outline) {
                mp.game.graphics.drawText(message, [(x + (this.rText.GetTextWidth(message, font, [w, h]) / 2)) / this.rVars.WindowX, y / this.rVars.WindowY], {
                    font: font,
                    color: [r, g, b, a],
                    scale: [w, h],
                    outline: outline,
                    centre: false
                });
                return;
            }
            mp.game.ui.drawText((x + (this.rText.GetTextWidth(message, font, [w, h]) / 2)) / this.rVars.WindowX, y / this.rVars.WindowY);
        },
        check_xy_in_xy: function (x, y, posX, posY, w, h) {
            return (posX + w > x && x > posX && posY + h > y && y > posY)
        },
        StringID: function (keyString){
          let hash = 0;
          for (let charIndex = 0; charIndex < keyString.length; ++charIndex)
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

    BeginWindow = (title, bool, poss, size, index) => {
        

        if (!this.Init[index]) {
            this.pos[index] = poss;
            this.Init[index] = true;
        }
       
        this.winsize[index] = size;
        size = this.winsize[index];

        // update screen info
        this.rVars.WindowX = mp.game.graphics.getScreenActiveResolution(100, 100).x
        this.rVars.WindowY = mp.game.graphics.getScreenActiveResolution(100, 100).y

        this.currentMenuState[index] = bool;

        // visible or not
        if (!bool) return;

        // draw main rectangle
        this.rInternal.DrawRect(this.pos[index].x, this.pos[index].y, size.x, size.y, this.Styles.WindowBg.r, this.Styles.WindowBg.g, this.Styles.WindowBg.b, this.Styles.WindowBg.a);

        if(this.Styles.DrawTitlebar)
        {
            // draw title rectangle
            this.rInternal.DrawRect(this.pos[index].x, this.pos[index].y - 25, size.x, 25, this.Styles.TitleBg.r, this.Styles.TitleBg.g, this.Styles.TitleBg.b, this.Styles.TitleBg.a);

            // draw title text
            if(this.Styles.CenterTitleText)
                this.rInternal.DrawText(title, (this.pos[index].x - this.rText.GetTextWidth(title, this.Styles.TitleFont, [0.28, 0.28]) / 2) + (size.x / 2) , this.pos[index].y - 24, 0.28, 0.28, this.Styles.TitleFont, this.Styles.TitleOutline, 255, 255, 255, 220);
            else 
                this.rInternal.DrawText(title, this.pos[index].x + 5 , this.pos[index].y - 24, 0.28, 0.28, this.Styles.TitleFont, this.Styles.TitleOutline, 255, 255, 255, 220);
        }
      
    }

    EndWindow = (index) => {

        if(this.rInternal.check_xy_in_xy(mp.gui.cursor.position[0], mp.gui.cursor.position[1], this.pos[index].x, this.pos[index].y - 25, this.winsize[index].x, 25) || this.guipressed[index])
        {
            if (mp.game.controls.isDisabledControlJustPressed(0, 24)) this.OldClickPos = mp.gui.cursor.position;
           
            if(mp.game.controls.isDisabledControlPressed(0, 24))
            {
                let newpos = mp.gui.cursor.position;
                this.guipressed[index] = true;
                this.pos[index].x += newpos[0] - this.OldClickPos[0];
                this.pos[index].y += newpos[1] - this.OldClickPos[1];
                this.OldClickPos = newpos;
                
            }
           
        }

        if (mp.game.controls.isDisabledControlJustReleased(0, 24)) 
        {
            this.guipressed[index] = false;
            this.resizepressed[index] = false;
            
        }

         // resize shit
         if(this.rInternal.check_xy_in_xy(mp.gui.cursor.position[0], mp.gui.cursor.position[1], this.pos[index].x + this.winsize[index].x - (25 / 2), this.pos[index].y + this.winsize[index].y - (25 / 2), 20, 20) || this.resizepressed[index])
         {
 
             if(!this.Styles.EnableResize) return;


             if (mp.game.controls.isDisabledControlJustPressed(0, 24)) this.OldClickPos = mp.gui.cursor.position;
 
             mp.gui.cursor.show(false, false);
 
             var x = mp.gui.cursor.position[0];
             var y = mp.gui.cursor.position[1];
             var w = 25;
             var h = 25;
 
             if (!mp.game.graphics.hasStreamedTextureDictLoaded("mp_freemode_mc")) {
                 mp.game.graphics.requestStreamedTextureDict("mp_freemode_mc", true);
             }
 
             if (mp.game.graphics.hasStreamedTextureDictLoaded("mp_freemode_mc")) {
                 mp.game.graphics.drawSprite("mp_freemode_mc", "mouse", (x + 5) / this.rVars.WindowX, (y + 5) / this.rVars.WindowY, w / this.rVars.WindowX, h / this.rVars.WindowY, 0, 255, 255, 255, 255);
             }
 
             if(mp.game.controls.isDisabledControlPressed(0, 24))
             {
                

                 let newposs = mp.gui.cursor.position;
                 this.resizepressed[index] = true;
                 this.winsize[index].x += newposs[0] - this.OldClickPos[0];
                 this.winsize[index].y += newposs[1] - this.OldClickPos[1];
                 this.OldClickPos = newposs;

                 if(this.winsize[index].x <= 250)
                 {
                    this.winsize[index].x = 250;
                 } 
                 if(this.winsize[index].y <= 250)
                 {
                    this.winsize[index].y = 250;
                 } 
                 
             }
 
         }
    }

    DrawRect = (posSet, size, color, index, outmenu) => {

        if(!outmenu)
            if(!this.currentMenuState[index]) return;

        this.rInternal.DrawRect(this.pos[index].x + posSet.x, this.pos[index].y + posSet.y, size.x, size.y, color.r, color.g, color.b, color.a);
    }

    Button = (title, posSet, size, index) => {

        if(!this.currentMenuState[index]) return;

        if(this.rInternal.check_xy_in_xy(mp.gui.cursor.position[0], mp.gui.cursor.position[1], this.pos[index].x + posSet.x, this.pos[index].y + posSet.y, size.x, size.y))
        {
            if(mp.game.controls.isDisabledControlPressed(0, 24))
            {
                this.rInternal.DrawRect(this.pos[index].x + posSet.x, this.pos[index].y + posSet.y, size.x, size.y, this.Styles.ButtonPressed.r, this.Styles.ButtonPressed.g, this.Styles.ButtonPressed.b, this.Styles.ButtonPressed.a);
            }
            else 
                this.rInternal.DrawRect(this.pos[index].x + posSet.x, this.pos[index].y + posSet.y, size.x, size.y, this.Styles.ButtonHovered.r, this.Styles.ButtonHovered.g, this.Styles.ButtonHovered.b, this.Styles.ButtonHovered.a);
        }
        else
            this.rInternal.DrawRect(this.pos[index].x + posSet.x, this.pos[index].y + posSet.y, size.x, size.y, this.Styles.ButtonNormal.r, this.Styles.ButtonNormal.g, this.Styles.ButtonNormal.b, this.Styles.ButtonNormal.a);


        this.rInternal.DrawText(title, this.pos[index].x + posSet.x + (size.x / 2) - (this.rText.GetTextWidth(title, this.Styles.MainFont, [0.28, 0.28]) / 2), this.pos[index].y + posSet.y + (size.y / 2) - 11, 0.28, 0.28, this.Styles.MainFont, this.Styles.MainFontOutline, this.Styles.CheckboxTick.r, this.Styles.CheckboxTick.g, this.Styles.CheckboxTick.b, this.Styles.CheckboxTick.a);

        if(this.rInternal.check_xy_in_xy(mp.gui.cursor.position[0], mp.gui.cursor.position[1], this.pos[index].x + posSet.x, this.pos[index].y + posSet.y, size.x, size.y))
        {

            if(mp.game.controls.isDisabledControlJustPressed(0, 24))
            {
                return true;
            }
        }

    }

    Slider = (title, variable, posSet, size, index) => {

        if(!this.currentMenuState[index]) return;


        if(this.rInternal.check_xy_in_xy(mp.gui.cursor.position[0], mp.gui.cursor.position[1], this.pos[index].x + posSet.x, this.pos[index].y + posSet.y, size.x, size.y))
        {
            if(mp.game.controls.isDisabledControlPressed(0, 24))
                this.rInternal.DrawRect(this.pos[index].x + posSet.x, this.pos[index].y + posSet.y, size.x, size.y, this.Styles.SliderPressed.r, this.Styles.SliderPressed.g, this.Styles.SliderPressed.b, this.Styles.SliderPressed.a);
            else 
                this.rInternal.DrawRect(this.pos[index].x + posSet.x, this.pos[index].y + posSet.y, size.x, size.y, this.Styles.SliderHovered.r, this.Styles.SliderHovered.g, this.Styles.SliderHovered.b, this.Styles.SliderHovered.a);
        }
        else
            this.rInternal.DrawRect(this.pos[index].x + posSet.x, this.pos[index].y + posSet.y, size.x, size.y, this.Styles.SliderNormal.r, this.Styles.SliderNormal.g, this.Styles.SliderNormal.b, this.Styles.SliderNormal.a);

        
        this.rInternal.DrawText(variable.value.toString(), this.pos[index].x + posSet.x + (size.x / 2) - (this.rText.GetTextWidth(variable.value.toString(), this.Styles.MainFont, [0.28, 0.28]) / 2), this.pos[index].y + posSet.y + (size.y / 2) - 11, 0.28, 0.28, this.Styles.MainFont, this.Styles.MainFontOutline, 255, 255, 255, 220);

        var length = (variable.value - variable.min) / (variable.max - variable.min) * (size.x - 11);

        this.rInternal.DrawRect(this.pos[index].x + posSet.x + length + 2, this.pos[index].y + posSet.y + 2, 7, size.y - 4, this.Styles.SliderGrab.r, this.Styles.SliderGrab.g, this.Styles.SliderGrab.b, this.Styles.SliderGrab.a);

        if(this.rInternal.check_xy_in_xy(mp.gui.cursor.position[0], mp.gui.cursor.position[1], this.pos[index].x + posSet.x, this.pos[index].y + posSet.y, size.x, size.y) || this.sliderpressedd[this.rInternal.StringID(title)])
        {

            if(mp.game.controls.isDisabledControlPressed(0, 24))
            {
            
                this.sliderpressedd[this.rInternal.StringID(title)] = true;

                var value = (mp.gui.cursor.position[0] - this.pos[index].x - posSet.x) / size.x * (variable.max - variable.min) + variable.min;

                if(variable.value < variable.min) variable.value = variable.min;
                else if(variable.value > variable.max) variable.value = variable.max;
                else variable.value = Math.round(value);
                if(variable.value > variable.max) variable.value = variable.max;
                if(variable.value < variable.min) variable.value = variable.min;
            }
 
        }

        if (mp.game.controls.isDisabledControlJustReleased(0, 24)) 
        {
            this.sliderpressedd[this.rInternal.StringID(title)] = false;
            
        }

        this.rInternal.DrawText(title, this.pos[index].x + posSet.x + size.x + 3, this.pos[index].y + posSet.y + (size.y / 2) - 11, 0.28, 0.28, this.Styles.MainFont, this.Styles.MainFontOutline, this.Styles.CheckboxTick.r, this.Styles.CheckboxTick.g, this.Styles.CheckboxTick.b, this.Styles.CheckboxTick.a);

    }

    Checkbox = (title, bool, posSet, index) => {

        if (!this.currentMenuState[index]) return;

        if(this.rInternal.check_xy_in_xy(mp.gui.cursor.position[0], mp.gui.cursor.position[1], this.pos[index].x + posSet.x, this.pos[index].y + posSet.y, 28 + this.rText.GetTextWidth(title, this.Styles.MainFont, [0.28, 0.28]), 25))
        {

            if (mp.game.controls.isDisabledControlJustPressed(0, 24))
            {
                bool.value = !bool.value;
            }


            this.rInternal.DrawRect(this.pos[index].x + posSet.x, this.pos[index].y + posSet.y, 25, 25, this.Styles.CheckboxHovered.r, this.Styles.CheckboxHovered.g, this.Styles.CheckboxHovered.b, this.Styles.CheckboxHovered.a);
        }
        else
        {
            this.rInternal.DrawRect(this.pos[index].x + posSet.x, this.pos[index].y + posSet.y, 25, 25, this.Styles.CheckboxNormal.r, this.Styles.CheckboxNormal.g, this.Styles.CheckboxNormal.b, this.Styles.CheckboxNormal.a);
        }
           

        this.rInternal.DrawText(title, this.pos[index].x + posSet.x + 28, this.pos[index].y + posSet.y + 1, 0.28, 0.28, this.Styles.MainFont, this.Styles.MainFontOutline, this.Styles.CheckboxTick.r, this.Styles.CheckboxTick.g, this.Styles.CheckboxTick.b, this.Styles.CheckboxTick.a);

        if(bool.value)
        {
            var x = this.pos[index].x + posSet.x - 7;
            var y = this.pos[index].y + posSet.y - 7;
            var w = 40;
            var h = 40;

            if (!mp.game.graphics.hasStreamedTextureDictLoaded("commonmenu")) {
                mp.game.graphics.requestStreamedTextureDict("commonmenu", true);
            }

            if (mp.game.graphics.hasStreamedTextureDictLoaded("commonmenu")) {
                mp.game.graphics.drawSprite("commonmenu", "shop_tick_icon", (x + w / 2) / this.rVars.WindowX, (y + h / 2) / this.rVars.WindowY, w / this.rVars.WindowX, h / this.rVars.WindowY, 0, 255, 255, 255, 240);
            }

        }

    }

    ShowCursor = (bool) => {
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

    }

    BlurBackground = (bool) => {
        if(bool)
            mp.game.graphics.transitionToBlurred(150);
        else
            mp.game.graphics.transitionFromBlurred(150);
    }

    GetKey = (key, type) => {

        switch (type) {
            case "JustPressed":
                return mp.game.controls.isDisabledControlJustPressed(0, key);

            case "JustReleased":
                return mp.game.controls.isDisabledControlJustReleased(0, key);

            case "IsPressed":
                return mp.game.controls.isDisabledControlPressed(0, key);
        }

    }

}
//////////////////////  rGUI Internals //////////////////////


//////////////////////  rGUI Example //////////////////////

let rGUI = new rGUIClass();

var cfg = {
    menushow: false,
    boxexample: {value: true},
    boxexample2: {value: true},
    sliderint: {value: 100, min: 0, max: 100},
    sliderint2: {value: 100, min: 10, max: 360},
    menupos: {x: 250, y: 250},
    menusize: {x: 640, y: 400},

    tabindex: 0,
}

rGUI.Styles.CenterTitleText = true; 
rGUI.Styles.TitleBg = {r: 42, g: 74, b: 123, a: 255};
rGUI.Styles.EnableResize = false;


rGUI.RAGE.AddEvent("render", () => {

    if(rGUI.GetKey(121, "JustReleased"))
    {
        cfg.menushow = !cfg.menushow;
        rGUI.BlurBackground(cfg.menushow);
    }
        

    rGUI.ShowCursor(cfg.menushow);  

    rGUI.BeginWindow("rGUI Example Window", cfg.menushow, cfg.menupos, cfg.menusize, 0);  // begin your window
    {
        if(rGUI.Button("First Tab", {x: 10, y: 10}, {x: 200, y: 30}, 0))
        {
            cfg.tabindex = 0;
        }

        if(rGUI.Button("Second Tab", {x: 220, y: 10}, {x: 200, y: 30}, 0))
        {
            cfg.tabindex = 1;
        }

        if(rGUI.Button("Third Tab", {x: 430, y: 10}, {x: 200, y: 30}, 0)) 
        {
            cfg.tabindex = 2;
        }

        rGUI.DrawRect({x: 10, y: 48}, {x: cfg.menusize.x - 20, y: 2}, rGUI.Styles.Seperator, 0);  

        if(cfg.tabindex == 0)
        {
            rGUI.Checkbox("Example Checkbox", cfg.boxexample, {x: 10, y: 60}, 0); 

            rGUI.Checkbox("Example Checkbox 2", cfg.boxexample2, {x: 10, y: 95}, 0);

            rGUI.Slider("Example Slider", cfg.sliderint, {x: 10, y: 130}, {x: 150, y: 25}, 0);

            rGUI.Slider("Example Slider 2", cfg.sliderint2, {x: 10, y: 165}, {x: 150, y: 25}, 0);

        }
    }
    rGUI.EndWindow(0);  
});

//////////////////////  rGUI Example //////////////////////