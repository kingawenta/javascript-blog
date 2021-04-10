'use strict';
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagArticleLink: Handlebars.compile(document.querySelector('#template-articleTag-link').innerHTML),
  authorArticleLink: Handlebars.compile(document.querySelector('#template-articleAuthor-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tagCloud-link').innerHTML),
  articleAuthorLink: Handlebars.compile(document.querySelector('#template-author-right-link').innerHTML)
};

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');


  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* add class 'active' to the clicked link */
  //console.log('clickedElement:', clickedElement);
  clickedElement.classList.add('active');
  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('article.active');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log(targetArticle);
  /* add class 'active' to the correct article */
  console.log('clickedElement:', targetArticle);
  targetArticle.classList.add('active');
}

const links = document.querySelectorAll('.titles a');

for(let link of links){
  link.addEventListener('click', titleClickHandler);
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = '.5',
  optCloudClassPrefix = 'tag-size-',
  optAuthorListSelector = '.list.authors';

function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* get the title from the title element */

    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    //console.log(linkHTML);
    /* insert link into titleList */
    html = html + linkHTML;
  }
  //console.log(html);
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

generateTitleLinks();

function calculateTagsParams(tags){
  const params = { min: 999999, max: 0};
  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    else if(tags[tag] < params.min){
      params.min = tags[tag];}
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

function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray){
      /* generate HTML of the link */
      const tagLinkHTML = '<li><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      //const linkHTMLData = {id:tag};
      //const tagLinkHTML = templates.tagLink(linkHTMLData);
      /* add generated code to html variable */
      html = html + tagLinkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]) {
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagWrapper.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagWrapper = document.querySelector(optTagsListSelector);
  /*[NEW] create variable for all links HTML code */
  const tagsParams = calculateTagsParams (allTags);
  console.log('tagsParams:', tagsParams);
  // let allTagsHTML = '';
  const allTagsData = {tags: []};
  console.log(allTagsData);
  /*[NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* allTagsHTML += tag + '(' + allTags[tag] + ')';*/
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /*[NEW] END LOOP: for each tag in allTags: */

  /* [NEW] add html from allTags to tagList */
  //tagList.innerHTML = allTags.join('');
  tagWrapper.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTags);
}
generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-','');
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let activeTag of activeTags){
    /* remove class active */
    activeTag.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for (let tag of tagLinks) {
    /* add class active */
    tag.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for (let tagLink of tagLinks) {
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click',tagClickHandler);
  /* END LOOP: for each link */
  }
}
addClickListenersToTags();

function generateAuthors () {
  /* find all articles */
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const authorList = article.querySelector(optArticleAuthorSelector);
    /* make html variable with empty string */
    //let html = '';
    /* get tags from data-tags attribute */
    const articleAuthor = article.getAttribute('data-author');
    /* generate HTML of the link */
    //const linkHTML = 'by <a href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a>';
    //html = html + linkHTML;
    const linkHTMLData = {name: articleAuthor, title: articleAuthor};
    const linkHTML = templates.authorArticleLink(linkHTMLData);
    /* END LOOP: for each tag */
    if(!allAuthors[articleAuthor]){
      allAuthors[articleAuthor] = 1;
    }else{
      allAuthors[articleAuthor]++;
    }
    /* insert HTML of all the links into the tags wrapper */
    authorList.innerHTML = linkHTML;
  }
  /* insert HTML of all the links into the tags wrapper */
  /* END LOOP: for every article: */
  /* "NEW" find wrapper of authors in right column */
  const authorLists = document.querySelector(optAuthorListSelector);

  //const tagsParams = calculateTagsParams(allAuthors);
  /* "NEW" creat variable for all links html code */

  const allAuthorsData = {authors: []};

  /*"NEW" START LOOP: for each author in allAuthors */
  for(let author in allAuthors){
    /* "NEW" generate code of link and add it to allAuthorsHTML */
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
      //className: calculateTagClass(allAuthorsData[author], tagsParams)
    });
  }
  /* "NEW" add HTML from allAuthorsHTML to tagList */
  authorLists.innerHTML = templates.articleAuthorLink(allAuthorsData);
}
generateAuthors();

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const author = href.replace('#author-','');
  /* find all tag links with class active */
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active tag link */
  for (let activeAuthor of activeAuthors){
    /* remove class active */
    activeAuthor.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href^="#author-' + author + '"]');
  /* START LOOP: for each found tag link */
  for (const authorLink of authorLinks) {
    /* add class active */
    authorLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  /* find all links to tags */
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');
  /* START LOOP: for each link */
  for (let authorLink of authorLinks) {
    /* add tagClickHandler as event listener for that link */
    authorLink.addEventListener('click',authorClickHandler);
  /* END LOOP: for each link */
  }
}
addClickListenersToAuthors();
