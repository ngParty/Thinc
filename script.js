(function IIFE( window, undefined ){

  'use strict';

  // Thinc Window object
  window.thinc = {
    tabsBox: null,    // Tabs holder
    pagesBox: null    // Pages holder
  };


  /**
   * Select proper page based selected tab
   */
  function clickTab( event ) {

    selectTab( window.thinc.tabsBox.selected );

    event.preventDefault();
    event.stopPropagation();

  }


  /**
   * Select proper page based selected tab
   */
  function selectTab( tabIndex ) {

    window.thinc.tabsBox.selected = tabIndex;
    window.thinc.pagesBox.selected = tabIndex;

  }


  /**
   * Select proper page based selected tab
   */
  function removeTab( tabIndex ) {
    
    window.thinc.tabsBox.childNodes[ tabIndex ].remove();
    window.thinc.pagesBox.childNodes[ tabIndex ].remove();

  }

  /**
   * Get tab index
   */
  function getTabIndex( tab ) {

    return Array.prototype.indexOf.call( window.thinc.tabsBox.childNodes, tab );

  }

  /**
   * Create new tab
   */
  function createTab( link ) {

    // Add page frame
    let pageFrame = document.createElement( 'iframe' );
    pageFrame.src = link;
    pageFrame.nwfaketop = 'nwfaketop';
    pageFrame.nwdisable = 'nwdisable';
    pageFrame.addEventListener( 'load', pageFrameLoaded );

    window.thinc.pagesBox.appendChild( pageFrame );

    // Add tab
    let paperTab = document.createElement( 'paper-tab' );
    paperTab.noink = 'false'; // Disable ink ripple effect
    
    let tabTitle = document.createElement( 'div' );
    tabTitle.innerText = 'New tab';
    tabTitle.className = 'title';
    paperTab.appendChild( tabTitle );

    let tabCloseButton = document.createElement( 'button' );
    tabCloseButton.innerText = 'X';
    tabCloseButton.type = 'button';
    paperTab.appendChild( tabCloseButton );

    tabCloseButton.addEventListener( 'click', closeTab, true );

    window.thinc.tabsBox.appendChild( paperTab );

    // Get tab index
    let tabIndex = getTabIndex( paperTab );

    // Select/Show tab and page
    window.thinc.pagesBox.selected = tabIndex;
    window.thinc.tabsBox.selected = tabIndex;

    // Show or hide tab bar
    toggleTabsBar();

  }


  /**
   * Show or hide tab bar if there are more than one tab
   */
  function toggleTabsBar() {
 
    let currentPageIndex = window.thinc.tabsBox.selected;
    let currentPageFrame = window.thinc.pagesBox.childNodes[ currentPageIndex ];

    if ( window.thinc.tabsBox.childNodes.length <= 1 ) {

      window.thinc.tabsBox.style.display = 'none';

      currentPageFrame.style.height = '100vh;';

    } else {

      window.thinc.tabsBox.style.display = 'flex';

      currentPageFrame.style.height = 'calc(100vh - 48px);';

    }

  }


  /**
   * Close tab
   */
  function closeTab( event ) {

    event.preventDefault();
    event.stopPropagation();

    let tabIndex = getTabIndex( this.parentElement );

    removeTab( tabIndex );

    let tabSelectDirection;

    // prevent negative direction for first tab
    if ( tabIndex === 0 ) {

      tabSelectDirection = 0;

    } else {

      tabSelectDirection = -1;

    }

    selectTab( tabIndex + tabSelectDirection );
    toggleTabsBar();

  }


  /**
   * Init window on body load
   */
  function onBodyLoad() {

    // Get window elements
    window.thinc.pagesBox = document.querySelector( 'core-pages' );
    window.thinc.tabsBox = document.querySelector( 'paper-tabs' );

    // Add tabs selector event
    window.thinc.tabsBox.addEventListener( 'core-select', clickTab, true );

    // Create first tab
    createTab( 'example.html' );

  }


  /**
   * Process frame when it is loaded
   */
  function pageFrameLoaded() {

    listenToLinkClicks( this );

    setPageFrameTitle( this );

  }


  /**
   * Set page frame title
   */
  function setPageFrameTitle( pageFrameElement ) {

    let pageTitle = pageFrameElement.contentWindow.document.title;

    let currentTabIndex = window.thinc.tabsBox.selected;

    let currentTab = window.thinc.tabsBox.childNodes[ currentTabIndex ];

    currentTab.querySelector( '.title' ).innerText = pageTitle;

  }

  


  /**
   * Listen to link clicks in pages and open them in new tab
   */
  function listenToLinkClicks( pageFrameElement ) {

    let pageLinks = pageFrameElement.contentWindow.document.body.getElementsByTagName( 'a' );

    for ( let i = 0, length = pageLinks.length; i < length; i++ ) {

      pageLinks[i].addEventListener( 'click', linkClick, true );

    }

  }


  /**
   * On every link click check for new tab opening
   */
  function linkClick( event ) {

    if ( event.metaKey || this.target === '_blank' ) {

      event.preventDefault();
      event.stopPropagation();

      createTab( this.href );
    }

  }

  // Add init event listener
  window.addEventListener( 'load', onBodyLoad );

})( window );