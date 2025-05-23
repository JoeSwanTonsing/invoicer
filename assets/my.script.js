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

function generateInvoiceNumber() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}-${hour}${minute}${second}`;
}

$(document).ready(function () {
    calculateTotals();
    $('#invoiceNumber').html(generateInvoiceNumber())
    $('#invoiceTable').on('input', '.rate, .quantity', calculateTotals);

    $('#addRow').click(function () {
        const row = `<tr>
       <td><input type="text" class="form-control" placeholder="Jersey" name="particulars[]"></td>
       <td>
        <select class="form-select size" required>
          <option value="">Select</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>
      </td>
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
        const customerName = $('#customerName').val().trim();
        const sanitizedName = customerName.replace(/\s+/g, '');
        const fileName = sanitizedName + '-Invoice.pdf';
        const opt = {
            margin: 0.5,
            filename: fileName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(document.getElementById('pdfContent')).set(opt).save();
    });

    // $('#generatePDF').click(function () {
    //     const customerName = $('#customerName').val().trim();
    //     const sanitizedName = customerName.replace(/\s+/g, '');
    //     const fileName = sanitizedName + '-Invoice.pdf';

    //     $('#pdfExcludeButtons').hide();

    //     html2pdf().from(document.getElementById('invoice')).set({
    //         filename: fileName
    //     }).save().then(() => {
    //         $('#pdfExcludeButtons').show();
    //     });
    // });

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