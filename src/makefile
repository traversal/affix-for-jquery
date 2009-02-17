# -- JavaScript Make File
# Prepares JavaScript files for distribution using Yahoo's YUI Compressor
# http://developer.yahoo.com/yui/compressor/

# --- Command Line Switches --- #
# BUILD <quick|final> 		The build type: fast = concatentation with no compression (for quick debugging), final = concatentation and compression
# MODE <unix|win>			The platform mode: unix = Unix based OSes: Unix, Linux, Mac OS X, Solaris. win = Windows

BUILD = final
MODE = unix

COMPLETE_CMD_UNIX = echo "BUILD COMPLETED: $$(date)"
COMPLETE_CMD_WIN = ver | TIME | FIND "current"


# --- YUI Compressor Paths --- #
YUI_PATH_UNIX = /Library/WebServer/yuicompressor.jar
YUI_PATH_WIN =  C:\\Inetpub\\AdminScripts\\yuicompressor.jar
CMD_COMPRESS_OPTIONS = --type=js 


ifeq ($(MODE), unix)

# --- Unix Setup --- #

SHELL=/bin/bash
# Directory Separator
DS = /
# OS commands
CMD_CAT = cat
CMD_CP = cp
# The YUI compressor command to run
CMD_COMPRESS = java -jar $(YUI_PATH_UNIX) $(CMD_COMPRESS_OPTIONS)

else

# --- Windows Setup --- #

SHELL=cmd.exe
# Directory Separator
DS = \\
# OS commands
CMD_CAT = type
CMD_CP = copy
# The YUI compressor command to run
CMD_COMPRESS = java -jar $(YUI_PATH_WIN) $(CMD_COMPRESS_OPTIONS)

endif

# --- Input and Output Files --- #
# Note - $(DS) is a variable symbol for the Directory Separator (allowing portability of this list between unix and windows)
# Wherever you need a directory path separator, you should use $(DS) instead of / (unix), \ (windows)

# The Directory where the final scripts will be installed 
INSTALL_DIR = ..$(DS)

# Final Output Files (For Combined Files)

# SITE_OUTPUT = $(INSTALL_DIR)site.js
LIB_OUTPUT = $(INSTALL_DIR)jquery.traversal.fix-min.js

LIB_FILES = \
	jquery.traversal.fix.js

# Separate Library Files compressed as separate files into the directory INSTALL_DIR - name of each file is the same as the original
# LIB_SEPARATE_FILES = \

# --- Make Rules --- #
all: make_lib complete
lib:  make_lib complete

# --- Library Build --- #
	
make_lib: $(LIB_FILES) $(LIB_SEPARATE_FILES)

ifdef LIB_FILES
	@echo Building Combined Library Files...
    ifeq ($(BUILD), fast)
		@$(CMD_CAT) $(LIB_FILES) > $(LIB_OUTPUT)
    else
		@$(CMD_CAT) $(LIB_FILES) | $(CMD_COMPRESS) $(CMD_COMPRESS_OPTIONS) > $(LIB_OUTPUT)
    endif
endif
	
complete:
    ifeq ($(MODE), unix)
#Unix Command
		@$(COMPLETE_CMD_UNIX)
    else
#Windows Command
		@$(COMPLETE_CMD_WIN)
    endif