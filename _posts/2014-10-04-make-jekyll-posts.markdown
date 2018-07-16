---
layout: post
title:  Make Jekyll Posts
date:   2014-10-04 10:14:50
categories: notes
---
Hello,

I decided to make a script to generate a [Jekyll][Jekyll] post file, using the correct file naming convention, and adding a formatted header.  You can find the source on Github: [mkjekyllpost.sh][source]

{% highlight bash %}
#!/bin/bash -   
#title          :mkjekyllpost.sh
#description    :Create a Jekyll filename in the correct format
#author         :J. Steve Martinez
#date           :20141004
#version        :0.1    
#usage          :./mkjekyllpost.sh
#notes          :       
#bash_version   :4.3.11(1)-release
#============================================================================

full_date=`date '+%Y-%m-%d %H:%M:%S'`
title_date=`date +%Y-%m-%d`

/usr/bin/clear

_make_title(){

    # Get the user input.
    printf "Enter a title: " ; read -r title

    # Save the original title
    original_title=${title}

    # Remove the spaces from the title if necessary.
    title=${title// /-}

    # Convert uppercase to lowercase.
    title=${title,,}

    # Add .markdown to the end of the title if it is not there already.
    [ "${title: -3}" != '.markdown' ] && title=${title}.markdown

    # Add the date to the beginning of the file
    title=${title_date}"-"${title}

    # Check to see if the file exists already.
    if [ -e $title ] ; then 
        printf "\n%s\n%s\n\n" "The script \"$title\" already exists." \
        "Please select another title."
        _make_title
    fi

}

_make_title

printf "Enter catagories: " ; read -r categories

cat << EOF > $title
---
layout: post
title:  $original_title
date:   $full_date
categories: ${categories}
---
EOF

_edit_file(){
  # Select between Vim or Emacs.
  printf "%s\n%s\n%s\n%s\n\n" "Select an editor." "1 for Vim." "2 for Emacs."\
          "3 for gedit"
  read -r editor
  # Open the file with the cursor on the twelth line.
  case $editor in
      1) vim +12 $title
          ;;
      2) emacs +12 $title &
          ;;
      3) gedit +12 $title &
          ;;
      *) /usr/bin/clear
         printf "%s\n%s\n\n" "I did not understand your selection." \
             "Press <Ctrl-c> to quit."
         _edit_file
          ;;
  esac
}

_edit_file

{% endhighlight %}

[source]:      https://github.com/j-steve-martinez/critical/blob/master/mkjekyllpost.sh
[jekyll]:      http://jekyllrb.com
