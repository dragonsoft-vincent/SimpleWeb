/**
 * Creates `rowspan` cells in a column when there are two or more cells in a 
 * row with the same content, effectively grouping them together visually. 
 * 
 * **Note** - this plug-in currently only operates correctly with 
 * **server-side processing**.
 *
 *  @name fnFakeRowspan
 *  @summary Create a rowspan for cells which share data
 *  @author Fredrik Wendel
 *
 *  @param {interger} iColumn Column index to have row span
 *  @param {boolean} [bCaseSensitive=true] If the data check should be case
 *    sensitive or not.
 *  @returns {jQuery} jQuery instance
 *
 *  @example
 *    $('#example').dataTable().fnFakeRowspan(3);
 */

jQuery.fn.dataTableExt.oApi.fnFakeRowspan = function ( oSettings, iColumn, bCaseSensitive ) {
	/* Fail silently on missing/errorenous parameter data. */
	if (isNaN(iColumn)) {
		return false;
	}

	if (iColumn < 0 || iColumn > oSettings.aoColumns.length-1) {
		alert ('Invalid column number choosen, must be between 0 and ' + (oSettings.aoColumns.length-1));
		return false;
	}

	bCaseSensitive = (typeof(bCaseSensitive) != 'boolean' ? true : bCaseSensitive);

	function fakeRowspan () {
		var firstOccurance = null,
			value = null,
			rowspan = 0;
		jQuery.each(oSettings.aoData, function (i, oData) {
			var val = oData._aData[iColumn],
				cell = oData.nTr.childNodes[iColumn];
			/* Use lowercase comparison if not case-sensitive. */
			if (!bCaseSensitive) {
				val = val.toLowerCase();
			}
			/* Reset values on new cell data. */
			if (val != value) {
				value = val;
				firstOccurance = cell;
				rowspan = 0;
			}

			if (val == value) {
				rowspan++;
			}

			if (firstOccurance !== null && val == value && rowspan > 1) {
				oData.nTr.removeChild(cell);
				firstOccurance.rowSpan = rowspan;
			}
		});
	}

	oSettings.aoDrawCallback.push({ "fn": fakeRowspan, "sName": "fnFakeRowspan" });

	return this;
};

jQuery.fn.dataTableExt.oApi.fnMultipleRowspan = function ( oSettings, iColumn, jColumn ) {
	/* Fail silently on missing/errorenous parameter data. */
	if (isNaN(iColumn) || isNaN(jColumn)) {
		return false;
	}

	if (iColumn < 0 || iColumn > oSettings.aoColumns.length-1) {
		alert ('Invalid column number choosen, must be between 0 and ' + (oSettings.aoColumns.length-1));
		return false;
	}
	
	if (jColumn < 0 || jColumn > oSettings.aoColumns.length-1) {
		alert ('Invalid column number choosen, must be between 0 and ' + (oSettings.aoColumns.length-1));
		return false;
	}

	function multipleRowspan () {
		var iFirstOccurance = null,
			jFirstOccurance = null,
			iValue = null,
			jValue = null,
			rowspan = 0;
		jQuery.each(oSettings.aoData, function (i, oData) {
			var iVal = oData._aData[iColumn],
				jVal = oData._aData[jColumn],
				iCell = oData.nTr.childNodes[iColumn],
				jCell = oData.nTr.childNodes[jColumn];
			
			/* Reset values on new cell data. */
			if (jVal != jValue) {
				iValue = iVal;
				jValue = jVal;
				iFirstOccurance = iCell;
				jFirstOccurance = jCell;
				rowspan = 0;
			}

			if (iVal == iValue && jVal == jValue) {
				rowspan++;
			}

			if (iFirstOccurance !== null && jFirstOccurance !== null && 
					iVal == iValue && jVal == jValue && rowspan > 1) {
				oData.nTr.removeChild(iCell);
				oData.nTr.removeChild(jCell);
				iFirstOccurance.rowSpan = rowspan;
				jFirstOccurance.rowSpan = rowspan;
			}
		});
	}

	oSettings.aoDrawCallback.push({ "fn": multipleRowspan, "sName": "fnMultipleRowspan" });

	return this;
};