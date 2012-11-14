class @FullJS.Sections.Section2 extends @FullJS.Sections.Base

	init: =>
		@container.css
			overflow: "hidden"

		@autoPostOffsetRatio = 10

		@item1 = @createItem
			position: "absolute"
		,'<img src="images/s.png" />'

		@item2 = @createItem
			position: "absolute"
		,'<img src="images/b.png" />'

		@item3 = @createItem
			position: "absolute"
		,'<img src="images/k.png" />'


	update: (absolute, relative, ratio, width, height)=>

		if relative > 0
			@container.css
				top: 0
				backgroundPosition: "0 " + (relative % 16) + "px"

		wh = width >> 1
		hh = height >> 1
		rr = 1 - ratio
		@item1.css
			left: ratio * -500 + (wh - 600)
			top: ratio * 500 + (hh - 300)

		@item2.css
			left: rr * (wh - 250)
			top: rr * (hh - 200)

		@item3.css
			left: rr * (wh + 40)
			top: rr * (hh - 500)


