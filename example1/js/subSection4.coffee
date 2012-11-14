class @FullJS.Sections.Section4 extends @FullJS.Sections.Base

	init: =>
		@container.css
			overflow: "hidden"

		size = FullJS.Util.window.size()
		@item1 = @createItem
			width: 100
			height: 100
			backgroundColor: "#FFFFFF"
			position: "absolute"
			top: 0
			left: size.width * 0.5

		@item2 = @createItem
			width: 200
			height: 100
			backgroundColor: "#FFFFFF"
			position: "absolute"
			top: size.height * 0.5
			left: 0

	update: (absolute, relative, ratio, width, height)=>

		@item1.css top: relative * 0.4 + 200
		@item2.css left: relative * 1.2

		if absolute > @anchor
			@manager.skipTo relative



