FROM python:3.9-buster
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY .tool-versions .

# Dockrfileデフォルトの sh ではなく bash を使う
SHELL ["/bin/bash", "-c"]

# asdf インストール
RUN git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.0

RUN echo -e '\n. $HOME/.asdf/asdf.sh' >> ~/.bashrc \
    && echo -e '\n. $HOME/.asdf/completions/asdf.bash' >> ~/.bashrc

ENV PATH="/root/.asdf/shims:/root/.asdf/bin:${PATH}"

RUN asdf plugin add poetry \
    && asdf plugin add python \
    && asdf install

# .venv の作成
COPY poetry.lock pyproject.toml ./

RUN poetry install


COPY . /app
EXPOSE 8000

CMD [ "poetry", "run", "uvicorn", "api.main:app", "--host", "0.0.0.0" ]