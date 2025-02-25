(function (window) {
  'use strict';

  var patternfly = {
    version: "3.59.4"
  };

  // definition of breakpoint sizes for tablet and desktop modes
  patternfly.pfBreakpoints = {
    'tablet': 768,
    'desktop': 1200
  };

  window.patternfly = patternfly;

})(typeof window !== 'undefined' ? window : global);

// Util: PatternFly Collapsible Left Hand Navigation
// Must have navbar-toggle in navbar-pf-alt for expand/collapse
(function ($) {

  'use strict';

  $.fn.navigation = function () {

    var navElement = $('.layout-pf-alt-fixed .nav-pf-vertical-alt'),
      bodyContentElement = $('.container-pf-alt-nav-pf-vertical-alt'),
      toggleNavBarButton = $('.navbar-toggle'),
      explicitCollapse = false,
      checkNavState = function () {
        var width = $(window).width();

        //Always remove the hidden & peek class
        navElement.removeClass('hidden show-mobile-nav collapsed');

        //Set the body class back to the default
        bodyContentElement.removeClass('collapsed-nav hidden-nav');

        // Check to see if the nav needs to collapse
        if (width < $.pfBreakpoints.desktop || explicitCollapse) {
          navElement.addClass('collapsed');
          bodyContentElement.addClass('collapsed-nav');
        }

        // Check to see if we need to move down to the mobile state
        if (width < $.pfBreakpoints.tablet) {
          //Set the nav to being hidden
          navElement.addClass('hidden');

          //Make sure this is expanded
          navElement.removeClass('collapsed');

          //Set the body class to the correct state
          bodyContentElement.removeClass('collapsed-nav');
          bodyContentElement.addClass('hidden-nav');
        }
      },
      collapseMenu = function () {
        //Make sure this is expanded
        navElement.addClass('collapsed');
        //Set the body class to the correct state
        bodyContentElement.addClass('collapsed-nav');

        explicitCollapse = true;
      },
      enableTransitions = function () {
        // enable transitions only when toggleNavBarButton is clicked or window is resized
        $('html').addClass('transitions');
      },
      expandMenu = function () {
        //Make sure this is expanded
        navElement.removeClass('collapsed');
        //Set the body class to the correct state
        bodyContentElement.removeClass('collapsed-nav');

        explicitCollapse = false;
      },
      bindMenuBehavior = function () {
        toggleNavBarButton.on('click', function (e) {
          var inMobileState = bodyContentElement.hasClass('hidden-nav');
          enableTransitions();

          if (inMobileState && navElement.hasClass('show-mobile-nav')) {
            //In mobile state just need to hide the nav
            navElement.removeClass('show-mobile-nav');
          } else if (inMobileState) {
            navElement.addClass('show-mobile-nav');
          } else if (navElement.hasClass('collapsed')) {
            expandMenu();
          } else {
            collapseMenu();
          }
        });
      },
      setTooltips = function () {
        $('.nav-pf-vertical-alt [data-toggle="tooltip"]').tooltip({'container': 'body', 'delay': { 'show': '500', 'hide': '200' }});

        $(".nav-pf-vertical-alt").on("show.bs.tooltip", function (e) {
          return $(this).hasClass("collapsed");
        });

      },
      init = function () {
        //Set correct state on load
        checkNavState();

        // Bind Top level hamburger menu with menu behavior;
        bindMenuBehavior();

        //Set tooltips
        setTooltips();
      };

    //Listen for the window resize event and collapse/hide as needed
    $(window).on('resize', function () {
      checkNavState();
      enableTransitions();
    });

    init();

  };

  $(document).ready(function () {
    if ($('.nav-pf-vertical-alt').length > 0) {
      $.fn.navigation();
    }
  });

}(jQuery));

// Util: PatternFly Collapse with fixed heights
// Update the max-height of collapse elements based on the parent container's height.
(function ($) {
  'use strict';

  $.fn.initCollapseHeights = function (scrollSelector) {
    var parentElement = this, setCollapseHeights, targetScrollSelector = scrollSelector;

    setCollapseHeights = function () {
      var height, openPanel, contentHeight, bodyHeight, overflowY = 'hidden';

      height = parentElement.height();

      // Close any open panel
      openPanel = parentElement.find('.collapse.in');
      if (openPanel && openPanel.length > 0) {
        openPanel.removeClass('in');
      }

      // Determine the necessary height for the closed content
      contentHeight = 0;
      parentElement.children().each($.proxy(function (i, element) {
        var $element = $(element);
        contentHeight += $element.outerHeight(true);
      }, parentElement)).end();

      // Determine the height remaining for opened collapse panels
      bodyHeight = height - contentHeight;

      // Make sure we have enough height to be able to scroll the contents if necessary
      if (bodyHeight < 25) {
        bodyHeight = 25;

        // Allow the parent to scroll so the child elements are accessible
        overflowY = 'auto';
      }

      // Reopen the initially opened panel
      if (openPanel && openPanel.length > 0) {
        openPanel.addClass("in");
      }

      setTimeout(function () {
        // Set the max-height for the collapse panels
        parentElement.find('[data-toggle="collapse"]').each($.proxy(function (i, element) {
          var $element, selector, $target, scrollElement, innerHeight = 0;
          $element = $(element);

          // Determine the selector to find the target
          selector = $element.attr('data-target');
          if (!selector) {
            selector = $element.attr('href');
          }

          // Determine the scroll element (either the target or the child of the target based on the given selector)
          $target = $(selector);
          scrollElement = $target;
          if (targetScrollSelector) {
            scrollElement = $target.find(targetScrollSelector);
            if (scrollElement.length === 1) {
              innerHeight = 0;
              $target.children().each($.proxy(function (j, sibling) {
                var $sibling = $(sibling);
                if (sibling !== scrollElement[0]) {
                  innerHeight += $sibling.outerHeight(true);
                }
              }, $target)).end();
              bodyHeight -= innerHeight;
            } else {
              scrollElement = $target;
            }
          }
          // Set the max-height and vertical scroll of the scroll element
          scrollElement.css({ 'max-height': (bodyHeight - innerHeight) + 'px', 'overflow-y': 'auto' });
        }, parentElement)).end();

        parentElement.css({ 'overflow-y': overflowY });
      }, 100);
    };

    setCollapseHeights();

    // Update on window resizing
    $(window).on('resize', setCollapseHeights);

  };

  $.fn.initFixedAccordion = function () {
    var fixedAccordion = this, initOpen;

    fixedAccordion.on('show.bs.collapse', '.collapse', function (event) {
      $(event.target.parentNode).addClass('panel-open');
    });

    fixedAccordion.on('hide.bs.collapse', '.collapse', function (event) {
      $(event.target.parentNode).removeClass('panel-open');
    });

    fixedAccordion.find('.panel').each(function (index, item) {
      $(item).removeClass('panel-open');
    });

    initOpen = $(fixedAccordion.find('.collapse.in'))[0];
    if (initOpen) {
      $(initOpen.parentNode).addClass('panel-open');
    }
  };

}(jQuery));