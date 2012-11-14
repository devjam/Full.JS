class @FullJS.Sections.Section2 extends @FullJS.Sections.Base

	init: =>
		@container.css
			overflow: "hidden"

		@item1 = @createItem
			width: 100
			height: 100
			backgroundColor: "#FFFFFF"
			position: "absolute"

		@item2 = @createItem
			width: 100
			height: 100
			backgroundColor: "#FFFFFF"
			position: "absolute"


	update: (absolute, relative, ratio, width, height)->

		ratio += 0.2
		size = if ratio < 0 then 0 else ratio * 100

		#@container.css
		#	left: -relative + (width - height)

		@container.css opacity: 1 - relative / if @inVector == 1 then -@preOffset else @postOffset

		@item1.css
			top: relative * 1.2
			right: relative * 0.4 + 200
			width: size
			height: size

		@item2.css
			top: relative * 0.4 + 200
			right: relative * 1.2 + 200


