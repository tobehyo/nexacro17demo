//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro17-public-license-readme-1.0.html	
//
//==============================================================================

//==============================================================================
// nexacro.Graphics
//==============================================================================
if (nexacro._GraphicsLayer && !nexacro._GraphicsLayerloaded)
{
    nexacro._GraphicsLayerloaded = true;
    var _pGraphicsLayer = nexacro._GraphicsLayer.prototype;
    //============================================================
    // nexacro._pGraphicsLayer : Logical Part
    //============================================================

    _pGraphicsLayer._setQuadTree = function (totalItems)  {};   // 디자인 모드에서 사용안함.

    delete _pGraphicsLayer;
}
