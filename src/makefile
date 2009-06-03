# -- JavaScript Make File
# Prepares JavaScript files for distribution using Yahoo's YUI Compressor
# http://developer.yahoo.com/yui/compressor/

# Makefile created by Travis Hensgen (Traversal) - http://traversal.com.au

# --- Command Line Switches --- #
# build <fast|final> 	The build type: fast = concatentation with no compression (for quick debugging), final = concatentation and compression
# os <unix|win>			The platform os: unix = Unix based OSes: Unix, Linux, Mac OS X, Solaris. win = Windows

os = unix

# Directory Separator setup - DON'T MODIFY THIS
ifeq ($(os), unix)
DS = /
else
DS=\\
endif

# Correct YUI option for JavaScript Files
CMD_COMPRESS_OPTIONS = --type=js

# --- YUI Compressor Paths --- #
# Set these to the correct path to the jar file for your platform
YUI_PATH_UNIX = /Library/WebServer/yuicompressor.jar
YUI_PATH_WIN =  C:\\Inetpub\\AdminScripts\\yuicompressor.jar


# ------------------------------------------------------------------------------------------------------------------------------
# INPUT & OUTPUT FILES 
# ------------------------------------------------------------------------------------------------------------------------------

# Note - $(DS) is a variable symbol for the Directory Separator
# To maintain portability between Unix and Windows
# ALWAYS USE $(DS) instead of / (unix), \\ (windows, escaped)


# ------------------------------------------------------------------------------------------------------------------------------
#  INPUT FILES 
# ------------------------------------------------------------------------------------------------------------------------------

# Site-Specific Scripts COMBINED then compressed into SITE_OUT. 
SITE_FILES = 
	
# Separate Site-Specific Scripts compressed as separate files into the directory SITE_SEP_DIR_OUT
SITE_SEP_FILES = 
	
# Library Scripts COMBINED then compressed into LIB_OUT. 
LIB_FILES = 

# Separate Library Scripts compressed as separate files into the directory LIB_SEP_DIR_OUT
LIB_SEP_FILES = \
	jquery.traversal.affix.js
	
# ------------------------------------------------------------------------------------------------------------------------------
#  OUTPUT FILES, PREFIXES, SUFFIXES
# ------------------------------------------------------------------------------------------------------------------------------

# General Output Directory where scripts can be installed (relative to this makefile)
# You don't have to use this, but it is useful for the common case when you want minified files in one directory 
DIR_OUT = ..$(DS)

# Output file for COMBINED site-specific scripts
SITE_OUT = $(DIR_OUT)site.min.js

# Output file for COMBINED library scripts
LIB_OUT = $(DIR_OUT)lib.min.js


# Output dir, prefix, suffix for SEPARATE Site-specific scripts
# Set SITE_SEP_OUT_SUFFIX to something other than .js to replace the extension of each output file (example .min.js)

SITE_SEP_DIR_OUT = $(DIR_OUT)
SITE_SEP_OUT_PREFIX = 
SITE_SEP_OUT_SUFFIX = .min.js

# Output dir, prefix, suffix for SEPARATE Library scripts
# Set LIB_SEP_OUT_SUFFIX to something other than .js to replace the extension of each output file (example .min.js)

LIB_SEP_DIR_OUT = $(DIR_OUT)
LIB_SEP_OUT_PREFIX = 
LIB_SEP_OUT_SUFFIX = .min.js







# ------------------------------------------------------------------------------------------------------------------------------
# NO NEED TO MODIFY ANYTHING BELOW THIS LINE
# ------------------------------------------------------------------------------------------------------------------------------


# -----------
# MAKE RULES

all: make_site make_lib complete
site: make_site complete
lib: make_lib complete

# -----------------
# OS PLATFORM SETUP


ifeq ($(os), unix)

# --- Unix Setup --- #

SHELL=/bin/bash
# OS commands
CMD_CAT = cat
CMD_CP = cp
# The YUI compressor command to run
CMD_COMPRESS = java -jar $(YUI_PATH_UNIX)
CMD_COMPLETE = echo "Completed: $$(date)"

else

# --- Windows Setup --- #

SHELL=cmd.exe
# OS commands
CMD_CAT = type
CMD_CP = copy
# The YUI compressor command to run
CMD_COMPRESS = java -jar $(YUI_PATH_WIN)
CMD_COMPLETE = echo Completed: %DATE% - %TIME%
# special options to keep the Windows command shell QUIET!
CMD_STDERR_SUPPRESS = 2>nul
CMD_STDOUT_SUPPRESS = >nul

endif

# --- Site Build --- #	

SITE_DEP = $(addprefix $(SITE_DIR), $(SITE_FILES)) $(addprefix $(SITE_DIR), $(SITE_SEP_FILES))
LIB_DEP = $(addprefix $(LIB_DIR), $(LIB_FILES)) $(addprefix $(LIB_DIR), $(LIB_SEP_FILES))



make_site: $(SITE_DEP)

ifneq ($(strip $(SITE_FILES)),)
    ifeq ($(build), fast)
		@echo Building Fast: Combined Site Files ...
		@$(CMD_CAT) $(SITE_FILES) > $(SITE_OUT)
    else
		@echo Building: Combined Site Files...
		@$(CMD_CAT) $(SITE_FILES) | $(CMD_COMPRESS) $(CMD_COMPRESS_OPTIONS) > $(SITE_OUT) $(CMD_STDERR_SUPPRESS)
    endif
endif

ifneq ($(strip $(SITE_SEP_FILES)),)
    ifeq ($(build), fast)
		@echo Building Fast: Separate Site Files...
        $(foreach f, $(SITE_SEP_FILES), $(shell $(CMD_CP) "$(f)" "$(SITE_SEP_DIR_OUT)$(SITE_SEP_OUT_PREFIX)$(notdir $(basename $(f)))$(SITE_SEP_OUT_SUFFIX)" $(CMD_STDOUT_SUPPRESS))) 
    else
		@echo Building: Separate Site Files...
        $(foreach f, $(SITE_SEP_FILES), $(shell $(CMD_COMPRESS) $(CMD_COMPRESS_OPTIONS) $(f) > $(SITE_SEP_DIR_OUT)$(SITE_SEP_OUT_PREFIX)$(notdir $(basename $(f)))$(SITE_SEP_OUT_SUFFIX))) 
    endif
endif

# --- Library Build --- #

make_lib: $(LIB_DEP)

ifneq ($(strip $(LIB_FILES)),)
    ifeq ($(build), fast)
		@echo Building Fast: Combined Library Files...
		@$(CMD_CAT) $(addprefix $(LIB_DIR), $(LIB_FILES)) > $(LIB_OUT) $(CMD_STDERR_SUPPRESS)
    else
		@echo Building: Combined Library Files...
		@$(CMD_CAT) $(addprefix $(LIB_DIR), $(LIB_FILES)) $(CMD_STDERR_SUPPRESS) | $(CMD_COMPRESS) $(CMD_COMPRESS_OPTIONS) > $(LIB_OUT)
    endif
endif

ifneq ($(strip $(LIB_SEP_FILES)),)
    ifeq ($(build), fast)
		@echo Building Fast: Separate Library Files...
        $(foreach f, $(LIB_SEP_FILES), $(shell $(CMD_CP) "$(f)" "$(LIB_SEP_DIR_OUT)$(LIB_SEP_OUT_PREFIX)$(notdir $(basename $(f)))$(LIB_SEP_OUT_SUFFIX)" $(CMD_STDOUT_SUPPRESS))) 
    else
		@echo Building: Separate Library Files...
        $(foreach f, $(LIB_SEP_FILES), $(shell $(CMD_COMPRESS) $(CMD_COMPRESS_OPTIONS) $(f) > $(LIB_SEP_DIR_OUT)$(LIB_SEP_OUT_PREFIX)$(notdir $(basename $(f)))$(LIB_SEP_OUT_SUFFIX))) 
    endif
endif


complete:
	@$(CMD_COMPLETE)