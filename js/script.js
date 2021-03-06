
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
};

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-',
  optAuthorsListSelector = '.list.authors';

/* const opts = {
    tagSizes: {
      count: 5,
      classPrefix: 'tag-size-',
    },
  };

  const select = {
    all: {
      articles: '.post',
      linksTo: {
        tags: 'a[href^="#tag-"]',
        authors: 'a[href^="#author-"]',
      },
    },
    article: {
      tags: '.post-tags .list',
      author: '.post-author',
    },
    listOf: {
      titles: '.titles',
      tags: '.tags.list',
      authors: '.authors.list',
    },
  }; */


const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  //console.log('Link was clicked!');
  //console.log(event);


  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');

  //console.log('clickedElement:', clickedElement);

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');

  //console.log(articleSelector);

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);

  //console.log(targetArticle);

  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');

  //console.log('targetArticle:', targetArticle);
};



function generateTitleLinks(customSelector = '') {

  /* [DONE] remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);

  function clearTitleList() {
    titleList.innerHTML = '';
    document.querySelectorAll('.list titles').innerHTML = '';
    //console.log(titleList);
  }

  clearTitleList();



  /* [DONE]for each article, FIND all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  //console.log(customSelector);
  //console.log(optArticleSelector + customSelector);

  let html = '';

  for(let article of articles){

    /* [DONE]get the article id */
    const articleId = article.getAttribute('id');

    /* [DONE]1.1 find the title element */
    /* [DONE]1.2 get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* [DONE]create HTML of the link */

    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    //console.log(linkHTML);
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* [DONE]insert link into titleList */
    //titleList.insertAdjacentHTML('beforeEnd', linkHTML);
    html = html + linkHTML;

    //console.log(html);
  }

  titleList.innerHTML = html;


}

generateTitleLinks();




const links = document.querySelectorAll('.titles a');
//console.log(links);

for(let link of links){
  link.addEventListener('click', titleClickHandler);
}



function calculateTagsParams(tags) {
  const params = { max: 0 , min: 999999 };
  for(let tag in tags){
    //console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max) {
      params.max = tags[tag];
    }
    if(tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}




function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  //console.log(normalizedCount);
  const normalizedMax = params.max - params.min;
  //console.log(normalizedMax);
  const percentage = normalizedCount / normalizedMax;
  //console.log(percentage);
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  //console.log(optCloudClassPrefix + classNumber);
  return optCloudClassPrefix + classNumber;
}





function generateTags() {
  /*[NEW] create a new variable allTags with an empty array */
  let allTags = {};
  //onsole.log(allTags);

  /* [DONE]find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  //console.log(articles);

  /* [DONE]START LOOP: for every article: */
  for(let article of articles) {

    /* [DONE]find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);

    /* [DONE]make html variable with empty string */
    let html = '';

    /* [DONE]get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    //console.log(articleTags);

    /* [DONE]split tags into array */
    const articleTagsArray = articleTags.split(' ');
    //console.log(articleTagsArray);

    /* [DONE]START LOOP: for each tag */
    for(let tag of articleTagsArray) {

      /* [DONE]generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      const linkHTMLData = { id: tag };
      const linkHTML = templates.tagLink(linkHTMLData);
      //console.log(linkHTML);

      /* [DONE]add generated code to html variable */
      html = html + linkHTML;

      /*[NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]) {

        /* [NEW] ADD tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* [DONE]END LOOP: for each tag */
    }

    /* [DONE]insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;

  /*[DONE] END LOOP: for every article: */
  }

  /*[NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector );

  /*[NEW] add html from allTags to tagList */
  //tagList.innerHTML = allTags.join(' ');
  const tagsParams = calculateTagsParams(allTags);
  //console.log('tagsParams:', tagsParams);

  /* [NEW] create variable for all links HTML code */
  //let allTagsHTML = '';
  const allTagsData = {tags: []};

  /*[NEW] START LOOP: for each tah in allTags */
  for(let tag in allTags) {

    /* [NEW] generate code of a link and add it to allTagsHTML */
    //allTagsHTML += '<li><a href="#tag-' + tag + '">' + tag + '</a> (' + allTags[tag] + ')</li>';
    const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '"' + '">' + tag + '</a></li>';
    //allTagsHTML += tagLinkHTML;
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
    console.log('tagLinkHTML:', tagLinkHTML);

  /* [NEW] END LOOP: for each tag in allTags */
  }

  /*[NEW] add HTML from allTagsHTML to tagList */
  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  //console.log(allTagsData);
}

generateTags();



function tagClickHandler(event) {

  /* [DONE]prevent default action for this event */
  event.preventDefault();

  /* [DONE]make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* [DONE]make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* [DONE]make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* [DONE]find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* [DONE]START LOOP: for each active tag link */
  for (let activeTagLink of activeTagLinks) {

    /* [DONE]remove class active */
    activeTagLink.classList.remove('active');

  /* [DONE]END LOOP: for each active tag link */
  }

  /* [DONE]find all tag links with "href" attribute equal to the "href" constant */
  const activeTagLinksEqualToHref = document.querySelectorAll('a[href="' + href + '"]');

  /* [DONE]START LOOP: for each found tag link */
  for(let activeTagLinkEqualToHref of activeTagLinksEqualToHref) {

    /* [DONE]add class active */
    activeTagLinkEqualToHref.classList.add('active');

  /* [DONE]END LOOP: for each found tag link */
  }

  /* [DONE]execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}



function addClickListenersToTags(){
  /* [DONE]find all links to tags */
  const links = document.querySelectorAll('.post-tags a, .tags a');

  /* [DONE]START LOOP: for each link */
  for(let link of links) {

    /* [DONE]add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);

  /* [DONE]END LOOP: for each link */
  }
}

addClickListenersToTags();



function calculateAuthorParams(authors) {
  const params = { max: 0, min: 999999 };
  for (let author in authors) {
    if (authors[author] > params.max) {
      params.max = authors[author];
    }
    if (authors[author] < params.min) {
      params.min = authors[author];
    }
  }
  return params;
}



function generateAuthors() {
  console.log('generateAuthors');
  /* [NEW] create a new variable allTags with an empty array */
  let allAuthors = {};

  /* [DONE]find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* [DONE] START LOOP: for every article: */
  for (let article of articles) {

    /* [DONE] find authors wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    //console.log(authorWrapper);

    /* [DONE]make html variable with empty string */
    let html = '';
    console.log(html);
    /* [DONE] get authors from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');

    /* [DONE] generate HTML of the link */
    //const authorLinkHTML = '<li><a href="#' + articleAuthor + '">' + articleAuthor + '</a></li>';
    const linkHTMLData = {
      id: articleAuthor
    };
    const linkHTML = templates.authorLink(linkHTMLData);
    //console.log(linkHTML);

    /* [DONE] add generated code to HTML variable */
    authorWrapper.insertAdjacentHTML('beforeEnd', linkHTML);
    //html = html + authorLinkHTML;

    /* [DONE]insert HTML of all the links into the author wrapper */
    //authorWrapper.innerHTML = html;


    /* [NEW] check if this link is NOT already in allAuthors */
    if (!allAuthors[articleAuthor]) {

      /* [NEW] add generated code to allAuthors array */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }

  /* [DONE]END LOOP: for every article */
  }

  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector(optAuthorsListSelector);
  //console.log(authorList);

  /* [NEW] calculate numbers of authors params */
  const authorParams = calculateAuthorParams(allAuthors);
  console.log(authorParams);

  /* [NEW] create variable for all links HTML code */
  //let allAuthorHTML = '';
  //console.log(allAuthorHTML);
  const allAuthorData = {authors: []};
  //console.log(allAuthorData);

  /* [NEW] START LOOP: for each author in allAuthors: */
  for (let articleAuthor in allAuthors) {

    /* [NEW] generate code of a link and add it to allAuthorHTML */
    //const authorLinkHTML = '<li><a href="#' + articleAuthor + '">' + articleAuthor + '</a> (' + allAuthors[articleAuthor] + ')</li>';
    //allAuthorHTML += authorLinkHTML;
    //console.log('authorLinkHTML: ', authorLinkHTML);
    allAuthorData.authors.push({
      idauthor: articleAuthor,
      count: allAuthors[articleAuthor],
    });

    /* [NEW] END LOOP: for each articleAuthor in allAuthors: */
  }

  /* [NEW] add html from allAuthors to authorList */
  //authorList.innerHTML = allAuthorHTML;
  authorList.innerHTML = templates.authorCloudLink(allAuthorData);
  //console.log(allAuthorData);
  //console.log(authorList);

}

generateAuthors();



function authorClickHandler(event){
  /* [DONE]prevent default action for this event */
  event.preventDefault();

  /* [DONE]make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  //console.log(this);
  /* [DONE]make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  //console.log(href);
  /* [DONE]make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#', '');
  //console.log(author);
  /* [DONE]find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#"]');

  /* [DONE]START LOOP: for each active author link */
  for(let activeAuthorLink of activeAuthorLinks) {

    /* [DONE]remove class active */
    activeAuthorLink.classList.remove('active');

  /* [DONE]END LOOP: for each active author link */
  }

  /* [DONE]find all tag links with "href" attribute equal to the "href" constant */
  const activeAuthorLinksEqualToHref = document.querySelectorAll('a[href="' + href + '"]');

  /* [DONE]START LOOP: for each found author link */
  for(let activeAuthorLinkEqualToHref of activeAuthorLinksEqualToHref) {

    /* [DONE]add class active */
    activeAuthorLinkEqualToHref.classList.add('active');

  /* [DONE]END LOOP: for each found author link */
  }

  /* [DONE]execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}



function addClickListenersToAuthors(){
  /* [DONE]find all links to authors */
  const links = document.querySelectorAll('.post-author a, .authors a');
  //console.log(links);

  /* [DONE]START LOOP: for each link */
  for(let link of links) {

    /* [DONE]add tagClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);

  /* [DONE]END LOOP: for each link */
  }

}

addClickListenersToAuthors();
