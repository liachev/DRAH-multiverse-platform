/**
 * Main JavaScript file for the Multiverse Platform theme
 */

(function($) {
    'use strict';

    // Document ready
    $(document).ready(function() {
        // Mobile menu toggle
        $('.menu-toggle').on('click', function() {
            $(this).toggleClass('active');
            $('.main-navigation ul').slideToggle();
        });

        // Property gallery
        if ($('.property-gallery').length) {
            $('.property-thumbnail').on('click', function() {
                var imgSrc = $(this).find('img').attr('src').replace('-thumbnail', '-gallery');
                $('.property-main-image img').attr('src', imgSrc);
                $('.property-thumbnail').removeClass('active');
                $(this).addClass('active');
            });
        }

        // Finance calculator
        if ($('#finance-calculator-form').length) {
            $('#finance-calculator-form').on('submit', function(e) {
                e.preventDefault();
                calculateMortgage();
            });

            // Update values on slider change
            $('#loan-amount-slider').on('input', function() {
                $('#loan-amount').val($(this).val());
                calculateMortgage();
            });

            $('#interest-rate-slider').on('input', function() {
                $('#interest-rate').val($(this).val());
                calculateMortgage();
            });

            $('#loan-term-slider').on('input', function() {
                $('#loan-term').val($(this).val());
                calculateMortgage();
            });

            // Update sliders on input change
            $('#loan-amount').on('change', function() {
                $('#loan-amount-slider').val($(this).val());
                calculateMortgage();
            });

            $('#interest-rate').on('change', function() {
                $('#interest-rate-slider').val($(this).val());
                calculateMortgage();
            });

            $('#loan-term').on('change', function() {
                $('#loan-term-slider').val($(this).val());
                calculateMortgage();
            });

            // Initial calculation
            calculateMortgage();
        }

        // Auction countdown
        if ($('.auction-time-left').length) {
            updateAuctionCountdown();
            setInterval(updateAuctionCountdown, 1000);
        }

        // Property search form
        if ($('#property-search-form').length) {
            $('#property-search-form').on('submit', function(e) {
                e.preventDefault();
                var formData = $(this).serialize();
                var searchUrl = $(this).attr('action') + '?' + formData;
                window.location.href = searchUrl;
            });
        }
    });

    // Calculate mortgage payment
    function calculateMortgage() {
        var loanAmount = parseFloat($('#loan-amount').val());
        var interestRate = parseFloat($('#interest-rate').val());
        var loanTerm = parseInt($('#loan-term').val());
        
        if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
            return;
        }
        
        var monthlyInterestRate = (interestRate / 100) / 12;
        var numberOfPayments = loanTerm * 12;
        
        var payment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        
        $('#monthly-payment').text('$' + payment.toFixed(2));
        $('#total-payment').text('$' + (payment * numberOfPayments).toFixed(2));
        $('#total-interest').text('$' + ((payment * numberOfPayments) - loanAmount).toFixed(2));
        
        // Check DRAH Finance eligibility
        var ficoScore = parseInt($('#fico-score').val());
        if (!isNaN(ficoScore)) {
            if (ficoScore >= 500) {
                $('#eligibility-result').html('<span class="text-success">Eligible for DRAH Finance</span>');
            } else {
                $('#eligibility-result').html('<span class="text-danger">Not eligible for DRAH Finance (minimum FICO score: 500)</span>');
            }
        }
    }

    // Update auction countdown
    function updateAuctionCountdown() {
        $('.auction-countdown').each(function() {
            var endTime = parseInt($(this).data('end-time'));
            var now = Math.floor(Date.now() / 1000);
            var timeLeft = endTime - now;
            
            if (timeLeft <= 0) {
                $(this).text('Auction ended');
                return;
            }
            
            var days = Math.floor(timeLeft / 86400);
            var hours = Math.floor((timeLeft % 86400) / 3600);
            var minutes = Math.floor((timeLeft % 3600) / 60);
            var seconds = timeLeft % 60;
            
            var countdownText = '';
            if (days > 0) {
                countdownText += days + 'd ';
            }
            countdownText += hours + 'h ' + minutes + 'm ' + seconds + 's';
            
            $(this).text(countdownText);
        });
    }

    // Calculate construction cost
    function calculateConstructionCost() {
        var squareFeet = parseInt($('#square-feet').val());
        var packageType = $('#package-type').val();
        
        if (isNaN(squareFeet)) {
            return;
        }
        
        var costPerSqFt = 0;
        switch (packageType) {
            case 'standard':
                costPerSqFt = 175;
                break;
            case 'premium':
                costPerSqFt = 225;
                break;
            case 'custom':
                costPerSqFt = 275;
                break;
            default:
                costPerSqFt = 175;
                break;
        }
        
        var totalCost = squareFeet * costPerSqFt;
        var discountedCost = totalCost * 0.9; // 10% discount
        var savings = totalCost - discountedCost;
        
        $('#total-cost').text('$' + totalCost.toFixed(2));
        $('#discounted-cost').text('$' + discountedCost.toFixed(2));
        $('#savings').text('$' + savings.toFixed(2));
    }

})(jQuery);
