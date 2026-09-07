## Bay Area Wiki

Chronicling the culture, places, and ideas of the San Francisco Bay Area.

Particular emphasis is placed on the Bay Area's [Megascene](https://bayarea.wiki/megascene).

### Writing an article

Articles are plain Markdown files organized into three folders:

```text
content/
├── places/
├── culture-and-ideas/
└── artifacts/
```

The folder supplies the article's category and the filename becomes its URL slug. Every article begins with its title and an introductory paragraph:

```md
# Solaris

**Solaris** was the name of a group housing community in Lower Haight, and a workspace in North Mission.
```

The `#` heading supplies the page title. The first prose paragraph becomes the archive excerpt and SEO description. Everything is standard Markdown.

Images live under `/public/images` and use normal Markdown image syntax. The optional image title becomes the visible caption:

```md
![Descriptive alt text](/images/solaris/solaris-sol.jpeg "Caption shown beneath the image")
```

Images are served through `next/image`, which resizes and converts them per device at request time. Originals only need to be about 1600px on the long edge. After adding new images, run `pnpm images` to downscale anything larger than that (or heavier than 500 KB).

_Caveat emptor: this project is very much subject to the curation and personal opinion of its [benevolent dictator](https://neall.org)._
