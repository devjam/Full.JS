class @FullJS.Sections.Section3 extends @FullJS.Sections.Base

	init: =>
		@container.css
			overflow: "hidden"

		@layoutType = FullJS.LAYOUT_TYPE_FIXED
		@length = 5000

		@oyaji = @container.find "#oyaji"

		@currentShiru = null
		@shiru = []
		@container.find("img").each (index, elm)=>
			elm = $ elm
			name = elm.attr "class"
			if name == "shiru"
				elm.css opacity: 0
				@shiru.push elm
			else
				@[name] = elm

		@chapon.css opacity: 0

	update: (absolute, relative, ratio, width, height)=>

		if relative < 1500
			oyajiY = -500
			if @currentShiru
				@currentShiru.css
					zIndex: 1
					opacity: 0
					top: 700
				@currentShiru = null
		else if relative < 2500
			oyajiY = (@getRatio relative, 1500, 2500) * -2000 - 500
			if @currentShiru
				@currentShiru.css
					zIndex: 1
					top: (@getRatio relative, 1500, 2500) * 2000  + 700
			else
				@currentShiru = @shiru[Math.random() * 4 >> 0]
				@currentShiru.css opacity: 1


		else
			oyajiY = (@getRatio relative, 4000, 3000) * 1500 - 500
			if @currentShiru
				@currentShiru.css
					zIndex: 0
					top: (@getRatio relative, 4000, 3000) * -1500 + 700
			
			@chapon.css opacity: @getRatio relative, 3450, 3700, 3550

		@oyaji.css
			opacity: @getRatio relative, 500, 1000
			top: oyajiY


		if relative > 4000 then @manager.skipTo @anchor + 1000



	getRatio: (value, min, max, mid)=>
		if isNaN mid
			ratio = (value - min) / (max - min)
			if ratio < 0 then 0 else if ratio > 1 then 1 else ratio
		else
			if value < mid
				@getRatio value, min, mid
			else
				@getRatio value, max, mid

			

