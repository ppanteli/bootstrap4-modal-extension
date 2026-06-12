/**
 * BS4Modal plugin
 * A lightweight jQuery plugin that dynamically loads modal content via AJAX or inline HTML,
 * built on top of Bootstrap 4 modals.
 * @param {Object} options
 */
(function($){
    'use strict';
    var dmw = window;

    $.fn.bs4Modal = function(options){
        if(typeof options === 'undefined') options = {};
        if(options == 'destroy'){
            $(this).off('click');
            return false;
        }
        $(this).each(function(){
            var $this = $(this);
            $this.on('click', function(e){
                e.preventDefault();
                var opts = $.extend({}, options);
                /* merge individual options */
                var data = $(this).data();
                if($this.attr('title'))
                    opts['title'] = $this.attr('title');
                if($this.attr('href'))
                    opts['href'] = $this.attr('href');
                var dmOptions = $.extend({}, opts, data);
                /** check if content is set through attr */
                if($this.attr('data-content')){
                    dmOptions['isAjax'] = false;
                } else {
                    if(typeof dmOptions['href'] === 'undefined' || dmOptions['href'] == '' || dmOptions['href'] == '#'){
                        console.warn('bs4Modal: href param is not set for element ' + $this[0]);
                        dmOptions['isAjax'] = false;
                        dmOptions['pageNotFound'] = true;
                    } else {
                        dmOptions['isAjax'] = true;
                    }
                }
                $.bs4Modal(dmOptions);
            });
        });
        return $(this);
    }; /** end $.fn.bs4Modal */

    $.bs4Modal = function(options){
        if(typeof options === 'undefined') options = {};
        if(!options.hasOwnProperty('isAjax')){
            options['isAjax'] = !options.hasOwnProperty('content');
        }
        return dmw.bs4Modal(options);
    };

    dmw.bs4Modal = function(options){
        if(typeof options === 'undefined') options = {};
        var pluginOptions = $.extend(true, {}, dmw.bs4Modal.pluginDefaults);
        pluginOptions = $.extend(true, {}, pluginOptions, options);
        var instance = new dmw.Modal(pluginOptions);
        dmw.bs4Modal.instances.push(instance);
        return instance;
    };

    dmw.Modal = function(options){
        $.extend(this, options);
        this._init();
    };

    dmw.Modal.prototype = {
        _init() {
            this.contentParsed = $(document.createElement('div')).addClass('modal-body-inner');
            this._id = Math.round(Math.random() * 99999);
            this._config = {};
            this._config.backdrop = this.backdrop;
            this._config.keyboard = this.keyboard;
            this._manualDismissCalled = false;
            setTimeout(() => this.open(), 0);
        },

        open() {
            if(this.isOpen())
                return false;
            this._manualDismissCalled = false;
            // Check how many modals exist in the page
            const $modalsInDom = $('body').find('.modal');
            var timeout = 0;
            if(dmw.bs4Modal.instances.length > 1){
                $modalsInDom.modal('hide');
                timeout = 150;
            }
            setTimeout(() => {
                this._buildHTML();
                this._bindEvents();
                this._open();
            }, timeout);
            return true;
        },

        close() {
            this._fireCallback('onClose');
            this.$el.remove();
            $(window).unbind('resize.' + this._id);
            var i = dmw.bs4Modal.instances.length - 1;
            for(; i >= 0; i--){
                if(dmw.bs4Modal.instances[i]._id === this._id){
                    dmw.bs4Modal.instances.splice(i, 1);
                }
            }
        },

        dismiss() {
            this._manualDismissCalled = true;
            $('#' + this._attrId).modal('hide');
        },

        isOpen() { return !this.isClosed(); },

        isClosed() { return !this.$el || this.$el.parent().length === 0; },

        setTitle(title) {
            if(title)
                this.title = title;
            this.$title.html(this.title || '');
            if(this.titleIcon !== false){
                this.$titleIcon = $(this.titleIconTemplate).html(this.titleIcon);
                this.$titleIcon.prependTo(this.$titleContainer);
            }
            if(this.subtitle !== false){
                this.$subtitle = $(this.subtitleTemplate).html(this.subtitle);
                this.$subtitle.appendTo(this.$title);
            }
        },

        setSubTitle(subtitle) {
            this.$subtitle = subtitle;
        },

        /** Safely invoke a lifecycle callback if the caller provided one. */
        _fireCallback(name) {
            if(typeof this[name] === 'function')
                this[name]();
        },

        refreshContent() {
            setTimeout(() => {
                this.hideLoading();
                //this._updateModalPosition();
                this._updateBodyMaxHeight();
            }, 300);
        },

        prependContent(content) {
            this.$body.prepend(content);
            this.refreshContent();
        },

        setContent(content) {
            if(content)
                this.contentParsed.html(content);
            this.$body.html(this.contentParsed);
            this.refreshContent();
        },

        showLoading() {
            this.$bodyContainer.addClass('loader-active');
            this.$bodyContainer.removeClass('loader-hidden');
            this.$loader.css('display', 'block');
            this.$loader.addClass('show');
        },

        hideLoading() {
            this.$loader.removeClass('show');
            this.$bodyContainer.removeClass('loader-active');
            setTimeout(() => {
                this.$bodyContainer.addClass('loader-hidden');
                this.$loader.css('display', 'none');
            }, 200);
        },

        isClosingDisabled() {
            const config = this._config;
            return config.backdrop === 'static' && config.keyboard === false;
        },

        disableClosing() {
            this._config.backdrop = 'static';
            this._config.keyboard = false;
            this.$el.find('[data-dismiss="modal"]').css('visibility', 'hidden');
        },

        resetClosing() {
            this._config.backdrop = this.backdrop;
            this._config.keyboard = this.keyboard;
            this.$el.find('[data-dismiss="modal"]').css('visibility', 'visible');
        },

        _buildHTML() {
            var template = $(this.template);
            template.attr('data-keyboard', this.keyboard).attr('data-backdrop', this.backdrop);
            template.attr('aria-labelledby', 'bs4Modal' + this._id);
            var idAttr = (this.hasOwnProperty('id')) ? this.id : 'bs4Modal' + this._id;
            this._attrId = idAttr;
            template.attr('id', idAttr);
            this.$el = template;
            this.$el.addClass(this.modalclass);
            this.$dialog = this.$el.find('.modal-dialog');
            this.$dialog.addClass(this.modalsize);
            this.$content = this.$el.find('.modal-content');
            this.$header = this.$el.find('.modal-header');
            this.$titleContainer = this.$el.find('.modal-title-container');
            this.$title = this.$el.find('.modal-title');
            this.$bodyContainer = this.$el.find('.modal-body-container');
            this.$loader = this.$el.find('.modal-loader');
            this.$body = this.$el.find('.modal-body');
            this.$footer = this.$el.find('.modal-footer').addClass(this.footerclass);
            this.$closebtn = $(this.closebtnTemplate).addClass(this.closebtnclass);
            if(this.animation !== false){
                this.$dialog.addClass('animation ' + this.animation);
                this.$dialog.css({'animation-duration': this.animationSpeed + 'ms'});
                if(this.animationDelay && this.animationDelay > 0)
                    this.$dialog.css({'animation-delay': this.animationDelay + 'ms'});
            }
            if(this.header === false)
                this.$header.remove();
            if(this.footer === false){
                if(this.closebtn === true){
                    this.$closebtn.appendTo(this.$footer);
                } else {
                    this.$footer.remove();
                }
            } else {
                this.$footer.html(this.footer);
            }
            if(this.closemodal == 'manual'){
                this.$el.find('[data-dismiss="modal"]').remove();
            }
            if(this.isAjax){
                if(this.hideLoader === false)
                    this.showLoading();
            }
            if(this.forceScrollableDialog === true){
                this.$dialog.addClass('modal-dialog-scrollable');
            }
            //this._updateModalPosition();
            this.setTitle();
            this.$el.appendTo($('body'));
            this._parseContent();
        }, /** end _buildHTML */

        _parseContent() {
            // Check if the request must be cached. If yes then try to get it from the cache.
            if(this.cache === true && dmw.bs4Modal.cacheStorage.hasOwnProperty(this.href)){
                this.content = dmw.bs4Modal.cacheStorage[this.href];
                this.contentParsed.html(this.content);
                this.setContent();
                return true;
            }

            this.content = this.content || '&nbsp;';

            if(this.isAjax){
                var jqxhr = $.get(this.href);
                jqxhr.done((html) => {
                    this.contentParsed.html(html);
                    this.setContent();
                    if(jqxhr.status == 200 && this.cache === true){
                        dmw.bs4Modal.cacheStorage[this.href] = html;
                    }
                });
                jqxhr.fail((_xhr, status, error) => {
                    this.setContent(this.ajaxErrorTemplate);
                    console.error('bs4Modal: AJAX request failed for "' + this.href + '" — ' + status + ' ' + error);
                });
            } else {
                this.contentParsed.html(this.content);
                this.setContent();
            }
        },

        _updateModalPosition() {
            console.log(this.forceScrollableDialog);
            if(this._isDeviceBreakdown() === false){
                this.$el.removeClass('modal-fixed');
                return true;
            }
            this.$el.addClass('modal-fixed');
        },

        _isDeviceBreakdown() {
            if(isNaN(this.mobileBreakdown))
                this.mobileBreakdown = false;
            if(this.mobileBreakdown === false)
                return false;
            if(window.matchMedia('(max-width: ' + this.mobileBreakdown + 'px)').matches === false){
                return false;
            }
            return true;
        },

        _getMaxBodyContainerHeight() {
            var windowHeight = $(window).outerHeight(true);
            var dialogOuterHeight = this.$dialog.outerHeight(true);
            var dialogInnerHeight = this.$dialog.outerHeight();
            var dialogHeaderHeight = this.$header.outerHeight();
            var height = windowHeight - ((dialogOuterHeight - dialogInnerHeight) + dialogHeaderHeight);
            if(this._isDeviceBreakdown() === true){
                var dialogFooterHeight = this.$footer.outerHeight();
                height = height - dialogFooterHeight;
            }
            return height;
        },

        _updateBodyMaxHeight() {
            if(this._isDeviceBreakdown() === false){
                //this.$bodyContainer.css({'max-height': 'initial'});
                return true;
            }
            //var height = this._getMaxBodyContainerHeight();
            //this.$bodyContainer.css({'max-height': height + 'px'});
        },

        _bindEvents() {
            $(window).on('resize.' + this._id, () => {
                //this._updateModalPosition();
                this._updateBodyMaxHeight();
            });
            this.$el.on('click', '[data-dismiss="modal"]', (e) => {
                e.preventDefault();
                this._manualDismissCalled = true;
                this.dismiss();
            });
        },

        _open() {
            this._onOpenBefore();
            this._fireCallback('onOpenBefore');
            var modal = this.$el.modal();
            modal.on('shown.bs.modal', () => {
                $('body').addClass('modal-open');
                this._fireCallback('onOpen');
                if(typeof window['AnimationsObserver'] === 'function'){
                    setTimeout(() => AnimationsObserver(), 300);
                }
            });
            modal.on('hide.bs.modal', () => {
                if(this._manualDismissCalled === false && this.isClosingDisabled())
                    return false;
                // Move focus away before Bootstrap sets aria-hidden on the modal element.
                // Bootstrap focuses the modal root (tabindex="-1") when it opens, so
                // document.activeElement may be the modal itself or a child — both cases
                // are handled here to prevent the aria-hidden focus constraint warning.
                var active = document.activeElement;
                if(active && this.$el[0].contains(active)){
                    active.blur();
                }
                this._fireCallback('onCloseBefore');
            });
            modal.on('hidden.bs.modal', () => {
                this.close();
            });
        },

        _onOpenBefore() {
            if(this.pageNotFound)
                this.setContent(this.pageNotFoundTemplate);
        }

    }; /** End modal prototype */

    dmw.bs4Modal.cacheStorage = {};
    dmw.bs4Modal.instances = [];
    dmw.bs4Modal.pluginDefaults = {
        template: `
            <div id="bs4Modal" class="modal custom-modal bs4-modal-plugin fade"
                 tabindex="-1" role="dialog" aria-hidden="true" aria-labelledby="bs4ModalTitle">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div class="modal-title-container">
                                <h4 class="modal-title"></h4>
                            </div>
                            <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                &times;
                            </button>
                        </div>
                        <div class="modal-body-container">
                            <div class="modal-loader fade">
                                <div class="loader-body">
                                    <div class="loader-spinner spinner spinning"></div>
                                    <h4 class="loader-title fw-1 mb-1">Loading</h4>
                                    Please wait...
                                </div>
                            </div>
                            <div class="modal-body"></div>
                        </div>
                        <div class="modal-footer"></div>
                    </div>
                </div>
            </div>`,
        title: 'Modal Title',
        subtitle: false,
        titleIcon: false,
        titleclass: '',
        modalclass: '',
        modalsize: '',
        content: '',
        closemodal: 'auto',
        pageNotFound: false,
        pageNotFoundTemplate: '<div class="alert alert-warning" style="margin-bottom:0;">Page not found!</div>',
        ajaxErrorTemplate: '<div class="alert alert-danger" style="margin-bottom:0;">Failed to load content. Please try again.</div>',
        forceScrollableDialog: false,
        backdrop: true,
        keyboard: true,
        animation: false,
        animationSpeed: 400,
        animationDelay: 0,
        isAjax: false,
        contentParsed: '',
        header: true,
        footer: false,
        footerclass: '',
        mobileBreakdown: 576,
        hideLoader: false,
        closebtn: false,
        closebtnclass: '',
        closebtnTemplate: '<button type="button" data-dismiss="modal" class="btn btn-modal-dismiss" aria-label="Close">Cancel</button>',
        subtitleTemplate: '<div class="modal-subtitle"></div>',
        titleIconTemplate: '<div class="modal-title-icon"></div>',
        cache: false
    }; /** end dmw.bs4Modal.pluginDefaults */

})(jQuery);
