class @FullJS.Sections.Section3 extends @FullJS.Sections.Base

	init: =>
		@container.css
			overflow: "hidden"

		@item1 = @createItem
			width: 10
			height: 500
			backgroundColor: "#FFFFFF"
			position: "absolute"
			top: 0
			left: 300

		@item2 = @createItem
			width: 500
			height: 10
			backgroundColor: "#FFFFFF"
			position: "absolute"
			top: 700
			left: 0


	update: (absolute, relative, ratio, width, height)=>

		@item1.css top: relative + 200
		@item2.css left: relative * 1.2


