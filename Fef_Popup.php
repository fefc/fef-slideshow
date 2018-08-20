<?php if (True == True) : ?>

	<?php add_thickbox(); ?>

	<a  href="#TB_inline&inlineId=fef-slideshow-popup&height=849&width=753&position=relative"
		class="button thickbox"
		id="fef-new-slideshow"
		title="New Slideshow">New Slideshow</a>

	<div id="fef-slideshow-popup" style="display: none;">
		<div id="fef-editor-slideshow">
			<div class="header">
				<div class="tab-router">
					<a id="fef-medias">Medias</a>
					<a id="fef-preview">Preview</a>
					<a id="fef-settings">Settings</a>
				</div>
			</div>
			<div class="main-content">
				<div id="fef-medias-tab" class="tab">
					<div class="tab-header">
					<a href="#" id="fef-select-medias" class="button button-primary">Select medias</a>
					<a href="#" id="fef-delete-medias" class="button">Delete selection</a>
					</div>
					<p id="fef-medias-tab-empty" style="padding:0 10px">Please select some medias</p>
					<ul id="fef-medias-tab-gallery" class="gallery">
					</ul>
				</div>
				<div id="fef-preview-tab" class="tab tab-container">
					<div id="fef-preview-tab-content" class="tab-content">
					</div>
				</div>
				<div id="fef-settings-tab" class="tab tab-container">
					<div class="tab-content">
						<h2>General</h2>
						<table>
							<tr>
								<td>Template</td>
								<td><select id="fef-tpl"><option value="0" selected >Classic</option><option value="1">Fancy</option></select></td>
								<td></td>
								<td>Default: Classic</td>
							</tr>
							<tr>
								<td>Aspect ratio</td>
								<td><input id="fef-rat-dividend" type="number" lang="en-150" min="1" step="1" value="16" style="width:60px">/<input id="fef-rat-divisor" type="number" min="1" step="1" value="9" style="width:60px"></td>
								<td></td>
								<td>Default: 16/9</td>
							</tr>
							<tr>
								<td>Slide period</td>
								<td><input id="fef-per" type="number" min="0" step="1" value="0"></td>
								<td>seconds</td>
								<td>Default: 0 (no automatic sliding)</td>
							</tr>
						</table>
						<h2>Advanced</h2>
						<table>
							<tr>
								<td>Align</td>
								<td><select id="fef-ali"><option value="left" selected >Left</option><option value="center">Center</option><option value="right">Right</option></select></td>
								<td></td>
								<td>Default: center</td>
							</tr>
							<tr>
								<td>Width</td>
								<td><input id="fef-width" type="number" lang="en-150" min="0" max="100" step="0.01" value="100"></td>
								<td>%</td>
								<td>Default: 100%</td>
							</tr>
							<tr>
								<td>Height</td>
								<td><input id="fef-height" type="number" lang="en-150" min="0" max="100" step="0.01" value="0"></td>
								<td>%</td>
								<td>Default: 0% (set by aspect ratio)</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
			<div class="footer">
				<a href="#" id="fef-insert-slideshow" class="button button-primary" style="float:right;">Insert_Update_Button</a>
			</div>
		</div>
	</div>
<?php endif; ?>
