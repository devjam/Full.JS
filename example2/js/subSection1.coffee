class @FullJS.Sections.Section1 extends @FullJS.Sections.Base

	init: =>
		@container.css
			overflow: "hidden"

		size = FullJS.Util.window.size()
		@bg = @createItem
			width: 1600
			height: 1000
			position: "absolute"
			top: 0
			left: 0
		, '<img src="images/bg_mesh.png" />'

		wh = size.width >> 1
		hh = size.height >> 1
		for i in [1..7]
			box = @["box"+i] = @createItem
				position: "absolute"
			, '<img src="images/box'+i+'.png" />'
			rad = Math.random() * Math.PI * 2
			box.x = Math.cos(rad) * size.width
			box.y = Math.sin(rad) * size.height
			box.offsetX = wh * (Math.random() * 0.7 + 0.3)
			box.offsetY = hh * (Math.random() * 0.7 + 0.3)


	update: (absolute, relative, ratio, width, height)=>

		wr = width / 1600
		hr = height / 1000
		imgRatio = if wr < hr then hr else wr
		h = 1000 * imgRatio
		@bg.css
			top: if imgRatio == hr then 0 else (height - h) * ratio
			width: 1600 * imgRatio
			height: h

		for i in [1..7]
			box = @["box"+i]
			box.css
				left: box.x * ratio + box.offsetX
				top: box.y * ratio + box.offsetY

	onResize: (width, height)=>
		if @isAutoMode
			switch @layoutType
				when FullJS.LAYOUT_TYPE_VERTICAL
					@container.height height
					@length = height * @autoLengthRatio
					@offset = height * @autoOffsetRatio
				when FullJS.LAYOUT_TYPE_HORIZONAL
					@container.width width
					@length = width * @autoLengthRatio
					@offset = width * @autoOffsetRatio


