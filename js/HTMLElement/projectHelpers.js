class projectHeader extends HTMLElement {
    constructor() {
      super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }

    connectedCallback() {
      if (!this.rendered) {
        this.render();
        this.rendered = true;
      }
    }

    static get observedAttributes() {
      return ['projectTitle', 'projectSummary', 'downloadLink', 'videoLink', 'videoLink'];
    }

    render() {
        let projectTitle = 
            '<h1 class="display-3 fw-bolder"><span class="text-gradient d-inline">' + this.getAttribute('projectTitle') + '</span></h1>';
        
        let projectSummary = 
            '<div class="fs-3 fw-light text-muted mb-5">' + this.getAttribute('projectSummary') + '</div>';
        
        let downloadLink = 
            '<div class="card shadow border-0 rounded-4 mb-5 px-5 py-3 me-sm-3 fs-6 fw-bolder">Download Unavailable</div>';
        if (this.getAttribute('downloadLink') != null){
          downloadLink =
              '<a class="btn btn-primary btn-lg px-5 py-3 me-sm-3 fs-6 fw-bolder" href="'+ this.getAttribute('downloadLink') +'">Download</a>';
        }
        
        let video = 
            '<iframe width="600" height="315" src="' + this.getAttribute('videoLink') + '" title="' + this.getAttribute('videoLink') + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
        
        
        this.innerHTML = `
          
        <div class="container px-5 pb-5">
          <div class="row gx-5 align-items-center">
              <div class="col-xxl-5">
                  <!-- Header text content-->
                  <div class="text-center text-xxl-start">
                      <!-- Project Name--> ` 
                      + projectTitle + 
                      `
                      <!-- Project Summary--> `
                      + projectSummary +
                      `
                      <div class="d-grid gap-3 d-sm-flex justify-content-sm-center justify-content-xxl-start mb-3"> `
                      + downloadLink +
                      ` 
                      </div>
                  </div>
              </div>
              <div class="col-xxl-7">
                  <!-- Video -->
                  <div class="d-flex justify-content-center mt-5 mt-xxl-0">
                      <div class="profile bg-gradient-primary-to-secondary center"> `
                      + video +
                      `
                      </div>
                  </div>
              </div>
          </div>
        </div>

        `;
      }

  }
  
  const bodyTmp = document.createElement('template');
  bodyTmp.innerHTML = `
    <link href="css/styles.css" rel="stylesheet"/>
    <div class="card shadow border-0 rounded-4 mb-5">
      <div class="card-body p-5">
        <div class="row align-items-center gx-5">
          <div>
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  `;
  
  class projectBodyMain extends HTMLElement {
    
    constructor() {
      super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }

    connectedCallback() {
      if (!this.rendered) {
        this.render();
        this.rendered = true;
      }
    }

    static get observedAttributes() {
      return ['bodyText', 'bodyTitle'];
    }

    render() {
      const shadowRoot = this.attachShadow({ mode: 'closed' });

      shadowRoot.appendChild(bodyTmp.content.cloneNode(true));
    }
  
  }
  

  const bodyBrightTmp = document.createElement('template');
  bodyBrightTmp.innerHTML = `
  <link href="css/styles.css" rel="stylesheet"/>
  <div class="col text-center text-lg-start mb-5 mb-lg-0">
    <div class="bg-white p-4 rounded-4">
      <slot></slot>
    </div>
  </div>
  `;
  
  class projectBodyBright extends HTMLElement {
    
    constructor() {
      super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }

    connectedCallback() {
      if (!this.rendered) {
        this.render();
        this.rendered = true;
      }
    }

    static get observedAttributes() {
      return ['bodyText', 'bodyTitle'];
    }

    render() {
      const shadowRoot = this.attachShadow({ mode: 'closed' });

      shadowRoot.appendChild(bodyBrightTmp.content.cloneNode(true));
    }
  
  }

  const bodyDarkTmp = document.createElement('template');
  bodyDarkTmp.innerHTML = `
    <link href="css/styles.css" rel="stylesheet"/>
    <div class="col text-center text-lg-start mb-5 mb-lg-0">
      <div class="bg-light p-4 rounded-4">
        <slot></slot>
      </div>
    </div>
  `;
  
  class projectBodyDark extends HTMLElement {
    
    constructor() {
      super();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }

    connectedCallback() {
      if (!this.rendered) {
        this.render();
        this.rendered = true;
      }
    }

    static get observedAttributes() {
      return ['bodyText', 'bodyTitle'];
    }

    render() {
      const shadowRoot = this.attachShadow({ mode: 'closed' });

      shadowRoot.appendChild(bodyDarkTmp.content.cloneNode(true));
    }
  
  }

  customElements.define('project-header-component', projectHeader);

  customElements.define('project-body-main', projectBodyMain);
  customElements.define('project-body-bright', projectBodyBright);
  customElements.define('project-body-dark', projectBodyDark);