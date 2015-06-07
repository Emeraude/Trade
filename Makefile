NAME		= 	trade

SRC		=	main.js

RM		= 	rm -f

all:		$(NAME)

$(NAME):	$(OBJ)
		@cp $(SRC) $(NAME)
		@printf "[\033[0;36mcopied\033[0m] % 32s\n" $(NAME) | sed "s/ /./5g"

clean:
fclean:
		@$(RM) $(NAME)
		@printf "[\033[0;31mdeleted\033[0m] % 30s\n" $(NAME) | sed "s/ /./4g"

re:		fclean all

.PHONY:		all fclean re
