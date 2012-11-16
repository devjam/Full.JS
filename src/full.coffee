###
Copyright (c) 2012 SHIFTBRAIN Inc.
http://www.shiftbrain.co.jp/
http://memo.devjam.net/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
###

unless @console?
  @console =
    log: ->

unless @FullJS?
	@FullJS =
		LAYOUT_TYPE_NONE: ""
		LAYOUT_TYPE_VERTICAL: "v"
		LAYOUT_TYPE_HORIZONAL: "h"
		LAYOUT_TYPE_FIXED: "f"
		EVENT_FORCE_LOOP_START: "EventForceLoopStart"
		EVENT_FORCE_LOOP_COMPLETE: "EventForceLoopComplete"

		Sections: {}
		Plugins: {}
		Actions: {}

Util = class FullJS.Util
	@UA = (->
		_ua = navigator.userAgent.toLowerCase()
		ua =
			isIE: false
			isIE6: false
			isIE7: false
			isIE8: false
			isLtIE9: false
			isIOS: false
			isIPhone: false
			isIPad: false
			isIPhone4: false
			isIPad3: false
			isAndroid: false
			isAndroidMobile: false
			isChrome: false
			isSafari: false
			isMozilla: false
			isWebkit: false
			isOpera: false
			isPC: false
			isTablet: false
			isSmartPhone: false
			
		if ua.isIE = /msie (\d+)/.test _ua
			ver = RegExp.$1
			ua.isIE6 = ver == 6
			ua.isIE7 = ver == 7
			ua.isIE8 = ver == 8
			ua.isLtIE9 = ver < 9
		if ua.isIPhone = /i(phone|pod)/.test _ua
			ua.isIPhone4 = window.devicePixelRatio == 2
		if ua.isIPad = /ipad/.test _ua
			isIPad3 = window.devicePixelRatio == 2
		ua.isIOS = ua.isIPhone || ua.isIPad
		ua.isAndroid = /android/.test _ua
		ua.isAndroidMobile = /android(.+)?mobile/.test _ua
		ua.isPC = !ua.isIOS && !ua.isAndroid
		ua.isTablet = ua.isIPad || (ua.isAndroid && ua.isAndroidMobile)
		ua.isSmartPhone = ua.isIPhone || ua.isAndroidMobile
		ua.isChrome = /chrome/.test _ua
		ua.isWebkit = /webkit/.test _ua
		ua.isOpera = /opera/.test _ua
		ua.isMozilla = _ua.indexOf("compatible") < 0 && /mozilla/.test _ua
		ua.isSafari = !ua.isChrome && ua.isWebkit
		ua
	)()

	@venderPrefix = (->
			if Util.UA.isIE then return "-ms-"
			if Util.UA.isWebkit then return "-webkit-"
			if Util.UA.isMozilla then return "-moz-"
			if Util.UA.isOpera then return "-o-"
			""
	)()

	###
	http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

	requestAnimationFrame polyfill by Erik Möller
	fixes from Paul Irish and Tino Zijdel
	fixes form kaminaly
	###
	@animationFrameDelta = 0
	(->
		isDateHasNow = !!Date.now
		lastTime = if isDateHasNow then Date.now() else +new Date
		callbacks = []
		
		setDelta = (calledTime)->
			Util.animationFrameDelta = calledTime - lastTime
			lastTime = calledTime
			window.requestAnimationFrame setDelta
			return
		
		if !window.requestAnimationFrame
			prefix = Util.venderPrefix.replace /-/g, ""
			window.requestAnimationFrame = window[prefix + "RequestAnimationFrame"]
			window.cancelAnimationFrame = window[prefix + "CancelAnimationFrame"] || window[prefix + "CancelRequestAnimationFrame"]
			
		if !window.requestAnimationFrame
			window.requestAnimationFrame = (->
				id = 0
				(callback, element)->
					if callbacks.length == 0
						id = setTimeout ->
							now = if isDateHasNow then Date.now() else +new Date
							
							#同期だと処理が溢れるかなと思って非同期を試したけど
							#パフォーマンスが悪かった。他になにかいい方法がある?
							#(今は同期)
							cbs = callbacks
							callbacks = []
							while cb = cbs.shift()
								cb now

							return
						, 16
						#setTimeoutのdelay値をdelta値によって可変させてみたけど、
						#具合が悪そうなので固定にした。
	
					callbacks.push callback
					id
			)()
			
			window.cancelAnimationFrame = (id)->
				callbacks = []
				clearTimeout id
	
		setDelta if isDateHasNow then Date.now() else +new Date
		return
	)()

	@window = (->
		win = $ window
		doc = $ document
		width = 0
		height = 0
		pageWidth = 0
		pageHeight = 0
		resizeCallbacks = []
		isUpdate = 0

		onResize = ->
			isUpdate = 3
			callbacks = resizeCallbacks.concat()
			for callback in callbacks
				callback()
			return

		win.resize onResize
		$(->
			width = win.width()
			height = win.height()
			pageWidth = doc.width()
			pageHeight = doc.height()
		)

		size: (withUpdate = false)->
			if withUpdate || isUpdate & 1
				isUpdate = (isUpdate | 1) ^ 1
				width = win.width()
				height = win.height()

			width: width
			height: height
			
		pageSize: (withUpdate = false)->
			if withUpdate || isUpdate & 2
				isUpdate = (isUpdate | 2) ^ 2
				pageWidth = doc.width()
				pageHeight = doc.height()

			width: pageWidth
			height: pageHeight


		bindResize: (callback)->
			if typeof callback == "function" && $.inArray(callback, resizeCallbacks) == -1
				resizeCallbacks.push callback
			return

		unbindResize: (callback, isReset = false)->
			if callback && (index = $.inArray callback, resizeCallbacks) != -1
				resizeCallbacks.splice index, 1
			if isReset
				resizeCallbacks = []
			return
	
	)()

	constructor: ->
		throw new Error('it is static class')


class FullJS.Sections.Base
	constructor: (@manager, @container, options = {})->
		if typeof @container == "string"
			@container = $(@container).eq(0)

		if @container?.length == 0
			@container = $("<div />")

		@container.css
			position: "absolute"
		
		@name = @container.attr "id"

		#TODO managerに問い合わせ出来るようにする？
		#TODO managerの方でアップデート処理する？
		@anchor = 0
		@subAnchors = []
		@actions = []

		#length と offsetを自動で設定(resize時も自動)
		@isAutoMode = true
		@layoutType = if options.layoutType then options.layoutType else FullJS.LAYOUT_TYPE_NONE

		#長さは高さや幅など、他のsectionと相対的に設定
		@autoLengthRatio = 1.0
		@length = 1

		@autoPreOffsetRatio = 1.0
		@autoPostOffsetRatio = 1.0
		@preOffset = 0
		@postOffset = 0

		@isIn = true
		@isCurrent = false
		@inVector = 1
		
		@_init()

	_init: ->
		@init()

		if @isAutoMode
			size = Util.window.size()
			switch @layoutType
				when FullJS.LAYOUT_TYPE_VERTICAL
					@length = @container.height() * @autoLengthRatio
					@preOffset = size.height * @autoPreOffsetRatio
					@postOffset = size.height * @autoPostOffsetRatio
				when FullJS.LAYOUT_TYPE_HORIZONAL
					@length = @container.width() * @autoLengthRatio
					@preOffset = size.width * @autoPreOffsetRatio
					@postOffset = size.width * @autoPostOffsetRatio



	init: ->
    #abstract

	_update: (position, width, height, vector, isScrollLayout, isResize)->
		#TODO planned event trigger
		if isResize
			@onResize width, height

		relative = position - @anchor
		ratio = relative / @length

		if isScrollLayout
			switch @layoutType
				when FullJS.LAYOUT_TYPE_VERTICAL
					@container.css
						top: -relative
				when FullJS.LAYOUT_TYPE_HORIZONAL
					@container.css
						left: -relative


		if -@preOffset <= relative <= @length + @postOffset
			if !@isIn
				#TODO planned event trigger
				@isIn = true
				@container.css
					display: "block"
				@inVector = vector
			
			#TODO どのタイミングでcurrentとするか。inVectorで分岐すべきか検討。
			if 0 <= relative <= @length
				if !@isCurrent
					#TODO planned event trigger
					@isCurrent = true
			else
				if @isCurrent
					#TODO planned event trigger
					@isCurrent = false

			@update position, relative, ratio, width, height, @inVector

			for action in @actions
				action.run position, relative, ratio, width, height, @inVector

		else
			if @isIn
				#TODO planned event trigger
				@isIn = false
				@container.css
					display: "none"

			if @isCurrent
				#TODO planned event trigger
				@isCurrent = false

		#TODO planned event trigger

	
	update: (absolute, relative, ratio, width, height, inVector)->
		#abstract

	addAction: (action)->
		if typeof action.run == "function" && $.inArray(action, @actions) == -1
			@actions.push actions
		return

	removeAction: (action, isReset = false)->
		if action && (index = $.inArray action, @actions) != -1
			@actions.splice index, 1
		if isReset
			@actions = []
		return

	createItem: (css = {}, tag = "<div />", container = @container)->
		$(tag).appendTo(container).css(css)

	onResize: (width, height)->
		if @isAutoMode
			switch @layoutType
				when FullJS.LAYOUT_TYPE_VERTICAL
					@container.height height
					@length = height * @autoLengthRatio
					@preOffset = height * @autoPreOffsetRatio
					@postOffset = height * @autoPostOffsetRatio

				when FullJS.LAYOUT_TYPE_HORIZONAL
					@container.width width
					@length = width * @autoLengthRatio
					@preOffset = width * @autoPreOffsetRatio
					@postOffset = width * @autoPostOffsetRatio


#TODO
class FullJS.Actions.Base
	constructor: (@element, @start, @end, @params)->

	run: (absolute, relative, ratio, width, height, inVector)->
		#abstract
		


#TODO
class FullJS.Plugins.Base
	constructor: ->




class Manager
	event = $ "<fulljs />"
	
	constructor: (@container, options)->
		if typeof @container == "string"
			@container = $ @container
		
		options = $.extend
			minWidth: 1000
			minHeight: 700
			speed: 0.01
			useScrollLayout: false
		, options
		
		@minWidth = options.minWidth
		@minHeight = options.minHeight
		@speed = options.speed
		
		@useScrollLayout = options.useScrollLayout
		@useWheel = false
		@isLoopStart = false

		@force = 0
		@position = 0
		@minPosition = 0
		@maxPosition = 0
		@sections = []
		@waitingSections = []

		Util.window.bindResize @onResize
	
	bind: (type, callback)->
		event.bind type, callback

	unbind: (type, callback)->
		event.unbind type, callback


	addWheelEvent: =>
		@useWheel = true
		if Util.UA.isIE then $(document).bind "mousewheel", @onWheel
		else $(window).bind "mousewheel", @onWheel
		return

	removeWheelEvent: ->
		@useWheel = false
		if Util.UA.isIE then $(document).unbind "mousewheel", @onWheel
		else $(window).unbind "mousewheel", @onWheel
		return

	onWheel: (event, delta, deltaX, deltaY)=>
		@force -= delta * 10
		@forceLoop()
		false

	forceLoop: ->
		if !@isLoopStart
			@isLoopStart = true
			event.trigger FullJS.EVENT_FORCE_LOOP_START
			
		if !@ticking
			@ticking = true
			requestAnimationFrame @update
		return

	update: =>
		if (if @force < 0 then -@force else @force) < 0.05
			dist = @force
			@force = 0
			@position = ((@position + dist) * 100 + 0.5 >> 0) / 100
		else
			#dist = @force * 0.16
			dist = @force * if (speed = @speed * Util.animationFrameDelta) > 0.9 then 0.9 else speed
			@force -= dist
			@position += dist

		if @position < @minPosition
			@position = @minPosition
		else if @position > @maxPosition
			@position = @maxPosition
		vector = if dist < 0 then -1 else 1
		size = Util.window.size()
		for section in @sections
 	   section._update @position, size.width, size.height, vector, @useScrollLayout
		@ticking = false

		if @force == 0
			@isLoopStart = false
			event.trigger FullJS.EVENT_FORCE_LOOP_COMPLETE
		else
			@forceLoop()
		return

	#TODO easeとtimeを指定できるようにする
	goto: (target, speed = @speed)->
		saveSpeed = @speed
		@speed = speed
		@bind FullJS.EVENT_FORCE_LOOP_COMPLETE, =>
			@speed = saveSpeed

		if @useWheel
			@bind FullJS.EVENT_FORCE_LOOP_COMPLETE, @addWheelEvent
			@removeWheelEvent()

		@force = target - @position
		@forceLoop()


	skipTo: (target)->
		@force = 0
		@position = target
		@update()


	gotoSection: (section, vector = 1)->
		if !@isScrollLayout
			@_moveToWaitingSection section, vector
			
		@goto section.anchor


	gotoSectionByName: (name, vector = 1)->
		if @isScrollLayout
			@gotoSection (@getSectionByName name), vector
		else
			@gotoSection (@getWaitingSectionByName name), vector


	skipToSection: (section)->
		if !@isScrollLayout
			@_moveToWaitingSection section

		@skipTo section.anchor


	skipToSectionByName: (name)->
		if @isScrollLayout
			@skipToSection (@getSectionByName name)
		else
			@skipToSection (@getWaitingSectionByName name)


	_moveToWaitingSection: (section, vector = 1)->
		if @containsWaitingSection section
			@removeWaitingSection section

		current = @getCurrentSection()
		@addSectionAt section, if vector < 0 then 0 else @sections.length
		@skipTo current.anchor
		
		@bind FullJS.EVENT_FORCE_LOOP_COMPLETE, =>
			@unbind FullJS.EVENT_FORCE_LOOP_COMPLETE, arguments.collee

			index = @sections.length
			while index--
				s = @sections[index]
				if s.layoutType != FullJS.LAYOUT_TYPE_FIXED && s.name != section.name
					@removeSection s

			@skipTo section.anchor


	#TODO classをもっと厳密にチェックする？
	createSection: (container, sectionClass, options, isAddSection)->
		if typeof sectionClass == "string"
			sectionClass = FullJS.Sections[sectionClass]
		if sectionClass
			section = new sectionClass @, container, options
			if isAddSection
				@addSection section

		section

	addSection: (section)->
		@addSectionAt section, @sections.length

	addWaitingSection: (section)->
		@addWaitingSectionAt section, @waitingSections.length

	removeSection: (section)->
		@removeSectionAt $.inArray section, @sections

	removeWaitingSection: (section)->
		@removeWaitingSectionAt $.inArray section, @waitingSections

	#addSection / removeSection系の実装もっと良い方法があるたぶん
	#TODO sectionをもっと厳密にチェックする？
	addSectionAt: (section, index)->
		if index >= 0
			oldIndex = $.inArray section, @sections
			if section && index != oldIndex
				@sections.splice index, 0, section
				if !(@removeSectionAt if index < oldIndex then oldIndex + 1 else oldIndex)
					@updateSections()
				return section

	addWaitingSectionAt: (section, index)->
		if index >= 0
			oldIndex = $.inArray section, @waitingSections
			if section && index != oldIndex
				@waitingSections.splice index, 0, section
				@removeWaitingSectionAt if index < oldIndex then oldIndex + 1 else oldIndex
				return section


	#TODO TEST
	removeSectionAt: (index)->
		if 0 <= index < @sections.length
			section = (@sections.splice index, 1)[0]
			#並べ替えのときに同時に同じsectionが存在してしまう事があるのでチェック
			if !@containsSection section
				section.container.remove()
				@addWaitingSection section
			@updateSections()
			return section

	#TODO TEST
	removeWaitingSectionAt: (index)->
		if 0 <= index < @waitingSections.length
			@waitingSections.splice index, 1

	containsSection: (section)->
		($.inArray section, @sections) != -1

	containsWaitingSection: (section)->
		($.inArray section, @waitingSections) != -1


	getCurrentSection: ->
		for section in @sections
			if section.layoutType != FullJS.LAYOUT_TYPE_FIXED && section.isCurrent
				return section

	getSectionAt: (index)->
		@sections[index]

	getSectionByName: (name)->
		for section in @sections
			if section.name == name
				return section
	
	getWaitingSectionAt: (index)->
		@waitingSections[index]

	getWaitingSectionByName: (name)->
		for section in @waitingSections
			if section.name == name
				return section


	updateSections: ->
		size = Util.window.size()
		anchor = 0
		offset = 0

		for section in @sections
			@container.append section.container
			if @useScrollLayout
				offset = 0
			else
				offset = if offset == 0 || offset > section.preOffset then offset else section.preOffset
			section.anchor = anchor + offset
			section._update @position, size.width, size.height, 1, @useScrollLayout, true
			anchor += section.length
			offset = section.postOffset

		@maxPosition = anchor


	onResize: =>
		@updateSections()



(->
	managers = []
	isLock = false
	defaultOptions =
		container: "body"
		minWidth: 1000
		minHeight: 700
		speed: 0.01
		useWheel: false
		useScrollLayout: false
		layoutType: ""
		init: ->
			$("html").css
				overflow:"hidden"
				width:"100%"
				height:"100%"

			$('body').css
				position: "relative"
				width:"100%"
				height:"100%"

			$(window).bind "scroll", ()->
				false

	createManager = (options)->
		options.init()
		manager = new Manager options.container, options
		if options.useWheel then manager.addWheelEvent()
		manager

	$.fn.addToFullJS = (options, managerId = 0)->
		manager = managers[managerId]
		if !manager
			options = $.extend defaultOptions, options
			manager = managers[managerId] = createManager options
		return @each (index)->
			isAddSection = false
			if index == 0 || options.useScrollLayout
				isAddSection = true
			container = $ @
			sectionClass = container.attr "id"
			section = manager.createSection container, sectionClass, options, isAddSection
			if !isAddSection then manager.addWaitingSection section
			return

	FullJS.getManager = (options, managerId = 0)->
		if isLock then return null
		if !managers[managerId]
			options = $.extend defaultOptions, options
			managers[managerId] = createManager options
		managers[managerId]

	FullJS.lock = ->
		isLock = true
)()

