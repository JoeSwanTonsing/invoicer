function calculateTotals() {
    let total = 0;
    $('#invoiceTable tbody tr').each(function () {
        const rate = parseFloat($(this).find('.rate').val()) || 0;
        const qty = parseFloat($(this).find('.quantity').val()) || 0;
        const amt = rate * qty;
        $(this).find('.total').val(amt.toFixed(2));
        total += amt;
    });
    $('#totalAmount').text(total.toFixed(2));
}

$(document).ready(function () {
    calculateTotals();
    $('#invoiceTable').on('input', '.rate, .quantity', calculateTotals);

    $('#addRow').click(function () {
        const row = `<tr>
       <td><input type="text" class="form-control" placeholder="Jersey" name="particulars[]"></td>
      <td><input type="number" class="form-control rate" name="rate[]" value="0"></td>
      <td><input type="number" class="form-control quantity" name="qty[]" value="1"></td>
      <td><input type="text" class="form-control total" name="total[]" readonly></td>
      </tr>`;
        $('#invoiceTable tbody').append(row);
    });

    // $('#itemTable').on('click', '.deleteRow', function () {
    //     $(this).closest('tr').remove();
    //     calculateTotals();
    // });

    $('#deleteRow').click(function () {
        const rowCount = $('#invoiceTable tbody tr').length;
        if (rowCount > 1) {
            $('#invoiceTable tbody tr:last').remove();
            calculateTotals(); // Optional: recalculate totals
        } else {
            alert('At least one row is required.');
        }
    });

    $('#generatePDF').click(function () {
        calculateTotals();
        const opt = {
            margin: 0.5,
            filename: 'invoice.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(document.getElementById('pdfContent')).set(opt).save();
    });

    $('#paymentMode').change(function () {
        const selected = $(this).val();
        if (selected === 'UPI' || selected === 'Bank Transfer') {
            $('#txnIdContainer').show();
        } else {
            $('#txnIdContainer').hide();
            $('#transactionId').val('');
        }
    });

    $('input[name="customisation"]').change(function () {
        if ($(this).val() === 'yes') {
            $('#customisationDetailsContainer').slideDown();
        } else {
            $('#customisationDetailsContainer').slideUp();
            $('#customisationDetails').val('');
        }
    });
});